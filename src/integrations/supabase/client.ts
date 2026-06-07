/* eslint-disable @typescript-eslint/no-explicit-any, no-empty, prefer-const */
import { createClient } from "@supabase/supabase-js";


const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Helper to create a dummy/mock client when Supabase is not configured
const createMockSupabaseClient = () => {
  console.warn(
    "⚠️ Supabase URL or Anon Key is missing. The application is running in mock mode. " +
    "To use real data, please create a '.env' file in the project root with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
  );

  const getMockData = (table: string) => {
    try {
      const raw = localStorage.getItem(`mock_${table}`);
      if (raw) return JSON.parse(raw);
    } catch {}
    
    // Seed default data for test convenience
    if (table === "contact_submissions") {
      return [
        {
          id: "mock-contact-1",
          name: "Paras Jain",
          email: "paras.jain@example.com",
          subject: "Inquiry about Sion Hostel Facilities",
          message: "Could you please let me know if there are slots available for CA students starting in July? I will be moving from Pune.",
          is_read: false,
          created_at: new Date().toISOString(),
        }
      ];
    }
    return [];
  };

  const saveMockData = (table: string, data: any[]) => {
    try {
      localStorage.setItem(`mock_${table}`, JSON.stringify(data));
    } catch {}
  };

  const createMockBuilder = (table: string) => {
    let filters: Array<(item: any) => boolean> = [];
    let sortField = "created_at";
    let sortAscending = false;
    let isCountQuery = false;
    let operation: "select" | "insert" | "update" | "delete" = "select";
    let opPayload: any = null;

    const builder: any = {
      select: (columns?: string, options?: any) => {
        operation = "select";
        if (options?.count) {
          isCountQuery = true;
        }
        return builder;
      },
      eq: (field: string, value: any) => {
        filters.push((item) => item[field] === value);
        return builder;
      },
      order: (field: string, options?: { ascending: boolean }) => {
        sortField = field;
        sortAscending = options?.ascending ?? false;
        return builder;
      },
      insert: (payload: any) => {
        operation = "insert";
        opPayload = payload;
        return builder;
      },
      update: (payload: any) => {
        operation = "update";
        opPayload = payload;
        return builder;
      },
      delete: () => {
        operation = "delete";
        return builder;
      },
      then: (resolve: any) => {
        const currentData = getMockData(table);
        
        if (operation === "insert") {
          const items = Array.isArray(opPayload) ? opPayload : [opPayload];
          const newItems = items.map(item => ({
            id: item.id || Math.random().toString(36).substring(2, 9),
            created_at: new Date().toISOString(),
            ...item
          }));
          const updated = [...newItems, ...currentData];
          saveMockData(table, updated);
          resolve({ data: Array.isArray(opPayload) ? newItems : newItems[0], error: null });
          return;
        }

        if (operation === "update") {
          const updated = currentData.map(item => {
            const matches = filters.every(f => f(item));
            if (matches) {
              return { ...item, ...opPayload };
            }
            return item;
          });
          saveMockData(table, updated);
          resolve({ data: opPayload, error: null });
          return;
        }

        if (operation === "delete") {
          const updated = currentData.filter(item => !filters.every(f => f(item)));
          saveMockData(table, updated);
          resolve({ data: null, error: null });
          return;
        }

        // select
        let result = currentData.filter((item: any) => filters.every(f => f(item)));
        
        result.sort((a: any, b: any) => {
          const valA = a[sortField];
          const valB = b[sortField];
          if (valA === undefined || valB === undefined) return 0;
          if (valA < valB) return sortAscending ? -1 : 1;
          if (valA > valB) return sortAscending ? 1 : -1;
          return 0;
        });

        if (isCountQuery) {
          resolve({ count: result.length, data: null, error: null });
        } else {
          resolve({ data: result, error: null });
        }
      },
      catch: (reject: any) => reject(new Error("Supabase is in mock mode")),
    };

    return builder;
  };

  const mockStorage = {
    from: () => ({
      upload: () => Promise.resolve({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150" } }),
      remove: () => Promise.resolve({ data: null, error: null }),
    }),
  };

  return {
    auth: {
      onAuthStateChange: (callback: any) => {
        setTimeout(() => callback("SIGNED_IN", { user: { id: "mock-user-id", email: "admin@ujsh.org" } }), 0);
        return {
          data: {
            subscription: {
              unsubscribe: () => {},
            },
          },
        };
      },
      getSession: () => Promise.resolve({ data: { session: { user: { id: "mock-user-id", email: "admin@ujsh.org" } } } }),
      signInWithPassword: () => Promise.resolve({ data: { user: { id: "mock-user-id", email: "admin@ujsh.org" } }, error: null }),
      signOut: () => Promise.resolve({ error: null }),
    },
    from: (table: string) => createMockBuilder(table),
    rpc: (name: string) => {
      if (name === "has_role") {
        return Promise.resolve({ data: true, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
    storage: mockStorage,
  } as any;
};

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createMockSupabaseClient();


