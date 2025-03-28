'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

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

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<'all' | 'team_lead' | 'team_member' | 'no_team'>('all');
  const [dietFilter, setDietFilter] = useState<'all' | 'vegetarian' | 'non_vegetarian'>('all');
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const router = useRouter();

  // Filter registrations based on search query and team filter
  const filteredRegistrations = registrations.filter(reg => {
    const matchesSearch = searchQuery === '' || 
      reg.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.sim_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTeamFilter = teamFilter === 'all' ||
      (teamFilter === 'team_lead' && reg.has_team && reg.is_team_lead) ||
      (teamFilter === 'team_member' && reg.has_team && !reg.is_team_lead) ||
      (teamFilter === 'no_team' && !reg.has_team);

    const matchesDietFilter = dietFilter === 'all' ||
      (dietFilter === 'vegetarian' && reg.is_vegetarian) ||
      (dietFilter === 'non_vegetarian' && !reg.is_vegetarian);

    return matchesSearch && matchesTeamFilter && matchesDietFilter;
  });

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
        setRegistrations(data || []);
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
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md w-fit"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 text-sm bg-muted hover:bg-muted/80 rounded-md flex items-center gap-2"
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
            Back to Main
          </button>
          <h1 className="text-2xl font-bold">Registrations</h1>
        </div>
        <div className="text-muted-foreground">
          Total: {filteredRegistrations.length}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or SIM ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value as typeof teamFilter)}
            className="px-4 py-2 rounded-md border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Teams</option>
            <option value="team_lead">Team Leads</option>
            <option value="team_member">Team Members</option>
            <option value="no_team">No Team</option>
          </select>
          <select
            value={dietFilter}
            onChange={(e) => setDietFilter(e.target.value as typeof dietFilter)}
            className="px-4 py-2 rounded-md border border-border/40 bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Diets</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="non_vegetarian">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      <div className="border border-border/40 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">SIM ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Telegram</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Course & University</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Team Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Team Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Diet</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredRegistrations.map((reg) => (
                <tr 
                  key={reg.id} 
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedRegistration(reg)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{reg.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reg.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reg.sim_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a 
                      href={`https://t.me/${reg.telegram_handle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {reg.telegram_handle.startsWith('@') ? reg.telegram_handle : `@${reg.telegram_handle}`}
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{reg.course_and_university}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {reg.has_team ? (
                      reg.is_team_lead ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Team Lead
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          Team Member
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        No Team
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{reg.team_name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      reg.is_vegetarian 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {reg.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(reg.registered_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">Registration Details</h2>
              <button
                onClick={() => setSelectedRegistration(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                  <p className="mt-1">{selectedRegistration.full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                  <p className="mt-1">{selectedRegistration.email}</p>
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
                      className="text-primary hover:underline"
                    >
                      {selectedRegistration.telegram_handle.startsWith('@') ? selectedRegistration.telegram_handle : `@${selectedRegistration.telegram_handle}`}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Course & University</h3>
                  <p className="mt-1">{selectedRegistration.course_and_university}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Team Status</h3>
                  <p className="mt-1">
                    {selectedRegistration.has_team ? (
                      selectedRegistration.is_team_lead ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          Team Lead
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary/10 text-secondary">
                          Team Member
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        No Team
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Team Name</h3>
                  <p className="mt-1">{selectedRegistration.team_name || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Team Lead Email</h3>
                  <p className="mt-1">{selectedRegistration.team_lead_email || '-'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Dietary Preference</h3>
                  <p className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedRegistration.is_vegetarian 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedRegistration.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                    </span>
                  </p>
                </div>
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Registration Date</h3>
                  <p className="mt-1">
                    {new Date(selectedRegistration.registered_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedRegistration(null)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 