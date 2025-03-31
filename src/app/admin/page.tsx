'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Registration {
  id: number;
  full_name: string;
  email: string;
  sim_id: string;
  course_and_university: string;
  has_team: boolean;
  is_team_lead: boolean | null;
  team_lead_email: string | null;
  team_name: string | null;
  registered_at: string;
  is_vegetarian: boolean;
  telegram_handle: string;
}

interface Team {
  name: string;
  members: Registration[];
  teamLead: Registration | null;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [soloParticipants, setSoloParticipants] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>('all');
  const [dietFilter, setDietFilter] = useState<string>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [view, setView] = useState<'list' | 'teams'>('list');
  const router = useRouter();

  // Group registrations by team
  const groupByTeam = (registrations: Registration[]) => {
    const teamsMap = new Map<string, Registration[]>();
    const solos: Registration[] = [];
    
    // First pass - collect all registrations by team lead email
    registrations.forEach(reg => {
      if (reg.has_team) {
        // For team leads, use their own email as the key
        if (reg.is_team_lead && reg.email) {
          const teamKey = reg.email;
          if (!teamsMap.has(teamKey)) {
            teamsMap.set(teamKey, []);
          }
          teamsMap.get(teamKey)?.push(reg);
        } 
        // For team members, use the team lead's email as the key
        else if (reg.team_lead_email) {
          const teamKey = reg.team_lead_email;
          if (!teamsMap.has(teamKey)) {
            teamsMap.set(teamKey, []);
          }
          teamsMap.get(teamKey)?.push(reg);
        } 
        // Fallback to team name if no email info is available
        else if (reg.team_name) {
          const teamKey = `name_${reg.team_name}`;
          if (!teamsMap.has(teamKey)) {
            teamsMap.set(teamKey, []);
          }
          teamsMap.get(teamKey)?.push(reg);
        }
        else {
          // If we can't properly identify the team, treat as solo
          solos.push(reg);
        }
      } else {
        solos.push(reg);
      }
    });
    
    // Second pass - create team objects with members and team lead
    const teamsArray: Team[] = Array.from(teamsMap.entries()).map(([, members]) => {
      const teamLead = members.find(member => member.is_team_lead) || null;
      // Use team name from lead's registration, or from any member if no lead found
      const teamName = teamLead?.team_name || members[0]?.team_name || 'Unnamed Team';
      return {
        name: teamName,
        members,
        teamLead
      };
    });
    
    // Sort teams by name for better display
    teamsArray.sort((a, b) => a.name.localeCompare(b.name));
    
    return { teams: teamsArray, soloParticipants: solos };
  };

  // Filter registrations based on search query and filters
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = searchQuery === '' || 
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.sim_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (reg.team_name && reg.team_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTeamFilter = teamFilter === 'all' ||
      (teamFilter === 'team_lead' && reg.has_team && reg.is_team_lead) ||
      (teamFilter === 'team_member' && reg.has_team && !reg.is_team_lead) ||
      (teamFilter === 'no_team' && !reg.has_team);

    const matchesDietFilter = dietFilter === 'all' ||
      (dietFilter === 'vegetarian' && reg.is_vegetarian) ||
      (dietFilter === 'non_vegetarian' && !reg.is_vegetarian);

    return matchesSearch && matchesTeamFilter && matchesDietFilter;
  });

  // Filter teams based on search query
  const filteredTeams = teams.filter(team => 
    searchQuery === '' || 
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.members.some(member => 
      member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const filteredSoloParticipants = soloParticipants.filter(reg => 
    searchQuery === '' || 
    reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reg.sim_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (!session) {
          router.push('/admin/login');
          return;
        }

        console.log('Fetching registrations...');
        const { data, error: dbError } = await supabase
          .from('registrations')
          .select('*')
          .order('registered_at', { ascending: false });

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        console.log('Fetched registrations:', data?.length || 0, 'records');
        const registrationsData = data || [];
        setRegistrations(registrationsData);
        
        // Group by team
        const { teams: teamsData, soloParticipants: solosData } = groupByTeam(registrationsData);
        setTeams(teamsData);
        setSoloParticipants(solosData);
      } catch (error) {
        console.error('Error:', error);
        if (error instanceof PostgrestError) {
          setError(`Database error: ${error.message}`);
        } else {
          setError('An error occurred while fetching data');
        }
      } finally {
        setLoading(false);
      }
    };

    // Set up realtime subscription
    const channel = supabase
      .channel('registrations')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'registrations' 
        }, 
        async () => {
          // Refresh the data when changes occur
          const { data } = await supabase
            .from('registrations')
            .select('*')
            .order('registered_at', { ascending: false });
          
          if (data) {
            setRegistrations(data);
            const { teams: teamsData, soloParticipants: solosData } = groupByTeam(data);
            setTeams(teamsData);
            setSoloParticipants(solosData);
          }
        }
      )
      .subscribe();

    fetchData();

    return () => {
      channel.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-lg">Loading registrations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <h3 className="font-bold mb-2">Error loading registrations:</h3>
          <p>{error}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="default"
        >
          Retry
        </Button>
      </div>
    );
  }

  const exportData = () => {
    const data = view === 'list' ? filteredRegistrations : 
      [...filteredTeams.flatMap(team => team.members), ...filteredSoloParticipants];
    
    const csv = [
      ['Full Name', 'Email', 'SIM ID', 'Telegram', 'Course & University', 'Team Status', 'Team Name', 'Diet', 'Registered At'],
      ...data.map(reg => [
        reg.full_name,
        reg.email,
        reg.sim_id,
        reg.telegram_handle,
        reg.course_and_university,
        reg.has_team ? (reg.is_team_lead ? 'Team Lead' : 'Team Member') : 'No Team',
        reg.team_name || '-',
        reg.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian',
        new Date(reg.registered_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registrations.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:px-4 sm:py-6 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <Badge variant="outline" className="text-sm">
            Total: {registrations.length}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Teams: {teams.length}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            Solo: {soloParticipants.length}
          </Badge>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle>Registrations</CardTitle>
          <CardDescription>
            View and manage all hackathon participant registrations
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 sm:p-4">
          <div className="space-y-4">
            <Tabs 
              defaultValue="list" 
              value={view} 
              onValueChange={(v) => setView(v as 'list' | 'teams')}
              className="w-full"
            >
              <div className="flex flex-col gap-4 mb-4">
                <TabsList className="w-full sm:w-auto justify-center">
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="teams">Team View</TabsTrigger>
                </TabsList>
                
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                      placeholder="Search by name, email, or team..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1"
                    />
                    
                    <div className="flex gap-2">
                      <Select value={teamFilter} onValueChange={setTeamFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Team Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Teams</SelectItem>
                          <SelectItem value="team_lead">Team Leads</SelectItem>
                          <SelectItem value="team_member">Team Members</SelectItem>
                          <SelectItem value="no_team">No Team</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={dietFilter} onValueChange={setDietFilter}>
                        <SelectTrigger className="w-full sm:w-[140px]">
                          <SelectValue placeholder="Diet Filter" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Diets</SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="non_vegetarian">Non-Vegetarian</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button onClick={exportData} variant="outline" size="icon" className="shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="7 10 12 15 17 10"/>
                          <line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <TabsContent value="list">
                <div className="border rounded-md overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead className="hidden md:table-cell">SIM ID</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead className="hidden md:table-cell">Team Name</TableHead>
                        <TableHead>Diet</TableHead>
                        <TableHead className="hidden sm:table-cell">Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                            No registrations found matching the filters
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <TableRow 
                            key={reg.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => setSelectedRegistration(reg)}
                          >
                            <TableCell className="font-medium">{reg.full_name}</TableCell>
                            <TableCell className="hidden sm:table-cell">{reg.email}</TableCell>
                            <TableCell className="hidden md:table-cell">{reg.sim_id}</TableCell>
                            <TableCell>
                              {reg.has_team ? (
                                reg.is_team_lead ? (
                                  <Badge variant="default">Lead</Badge>
                                ) : (
                                  <Badge variant="secondary">Member</Badge>
                                )
                              ) : (
                                <Badge variant="outline">None</Badge>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{reg.team_name || '-'}</TableCell>
                            <TableCell>
                              <Badge variant={reg.is_vegetarian ? "success" : "destructive"}>
                                {reg.is_vegetarian ? 'Veg' : 'Non-Veg'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              {new Date(reg.registered_at).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-2 text-xs text-muted-foreground sm:hidden">
                  * Swipe horizontally to see all data or tap a row for details
                </div>
              </TabsContent>
              
              <TabsContent value="teams">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredTeams.map((team) => (
                    <Card key={team.name} className="overflow-hidden h-full">
                      <CardHeader className="pb-2">
                        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span className="break-words">{team.name}</span>
                          <Badge variant="outline" className="shrink-0">{team.members.length} members</Badge>
                        </CardTitle>
                        <CardDescription>
                          Lead: {team.teamLead?.full_name || 'Unknown'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[60%]">Name</TableHead>
                                <TableHead className="w-[40%]">Role</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {team.members.map((member) => (
                                <TableRow 
                                  key={member.id}
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() => setSelectedRegistration(member)}
                                >
                                  <TableCell>{member.full_name}</TableCell>
                                  <TableCell>
                                    {member.is_team_lead ? (
                                      <Badge variant="default">Lead</Badge>
                                    ) : (
                                      <Badge variant="secondary">Member</Badge>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {filteredTeams.length === 0 && searchQuery !== '' && (
                    <div className="col-span-full p-4 text-center text-muted-foreground">
                      No teams found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                  
                  {filteredSoloParticipants.length > 0 && (
                    <Card className="col-span-full mt-6">
                      <CardHeader>
                        <CardTitle className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <span>Solo Participants</span>
                          <Badge variant="outline">{filteredSoloParticipants.length} participants</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="overflow-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead className="hidden sm:table-cell">Email</TableHead>
                                <TableHead className="hidden md:table-cell">SIM ID</TableHead>
                                <TableHead>Diet</TableHead>
                                <TableHead className="hidden sm:table-cell">Registered</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {filteredSoloParticipants.map((reg) => (
                                <TableRow 
                                  key={reg.id}
                                  className="cursor-pointer hover:bg-muted/50"
                                  onClick={() => setSelectedRegistration(reg)}
                                >
                                  <TableCell className="font-medium">{reg.full_name}</TableCell>
                                  <TableCell className="hidden sm:table-cell">{reg.email}</TableCell>
                                  <TableCell className="hidden md:table-cell">{reg.sim_id}</TableCell>
                                  <TableCell>
                                    <Badge variant={reg.is_vegetarian ? "success" : "destructive"}>
                                      {reg.is_vegetarian ? 'Veg' : 'Non-Veg'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">
                                    {new Date(reg.registered_at).toLocaleDateString()}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Registration Details Dialog */}
      <Dialog open={!!selectedRegistration} onOpenChange={(open) => !open && setSelectedRegistration(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto w-[calc(100%-32px)] rounded-lg">
          <DialogHeader className="text-left">
            <DialogTitle>Registration Details</DialogTitle>
          </DialogHeader>
          
          {selectedRegistration && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                <p className="mt-1">{selectedRegistration.full_name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="mt-1 break-words">{selectedRegistration.email}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">SIM ID</h3>
                <p className="mt-1">{selectedRegistration.sim_id}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Telegram</h3>
                <p className="mt-1">
                  <a 
                    href={`https://t.me/${selectedRegistration.telegram_handle.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-words"
                  >
                    {selectedRegistration.telegram_handle.startsWith('@') ? selectedRegistration.telegram_handle : `@${selectedRegistration.telegram_handle}`}
                  </a>
                </p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Course & University</h3>
                <p className="mt-1">{selectedRegistration.course_and_university}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Team Status</h3>
                <div className="mt-1">
                  {selectedRegistration.has_team ? (
                    selectedRegistration.is_team_lead ? (
                      <Badge variant="default">Team Lead</Badge>
                    ) : (
                      <Badge variant="secondary">Team Member</Badge>
                    )
                  ) : (
                    <Badge variant="outline">No Team</Badge>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Team Name</h3>
                <p className="mt-1">{selectedRegistration.team_name || '-'}</p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-muted-foreground">Team Lead Email</h3>
                <p className="mt-1 break-words">{selectedRegistration.team_lead_email || '-'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Dietary Preference</h3>
                <div className="mt-1">
                  <Badge variant={selectedRegistration.is_vegetarian ? "success" : "destructive"}>
                    {selectedRegistration.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
                <p className="mt-1">
                  {new Date(selectedRegistration.registered_at).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setSelectedRegistration(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 