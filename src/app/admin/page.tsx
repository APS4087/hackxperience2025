'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Registration {
  id: number;
  full_name: string;
  email: string;
  university: string;
  skills: string[];
  registered_at: string;
}

export default function AdminDashboard() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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
        <h1 className="text-2xl font-bold">Registrations</h1>
        <div className="text-muted-foreground">
          Total: {registrations.length}
        </div>
      </div>

      <div className="border border-border/40 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-6 py-3 text-left text-sm font-medium">Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium">University</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Skills</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {registrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 whitespace-nowrap">{reg.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reg.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{reg.university}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {reg.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
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
    </div>
  );
} 