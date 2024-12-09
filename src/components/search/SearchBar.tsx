import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { users } from "@/lib/api";

interface SearchBarProps {
  onResults: (results: any[]) => void;
  onLoading: (loading: boolean) => void;
}

export const SearchBar = ({ onResults, onLoading }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchUsers = async () => {
      if (debouncedQuery.trim().length < 2) {
        onResults([]);
        return;
      }

      try {
        onLoading(true);
        const response = await users.searchUsers(debouncedQuery);
        onResults(response);
      } catch (error) {
        console.error("Search error:", error);
        onResults([]);
      } finally {
        onLoading(false);
      }
    };

    searchUsers();
  }, [debouncedQuery, onResults, onLoading]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by username or email..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  );
};
