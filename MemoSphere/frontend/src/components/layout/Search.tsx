// src/components/layout/Search.tsx
import React, { useState } from 'react';
import { Search as SearchIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '../../components/ui/dialog';
import { Input } from '../../components/ui/input';

interface SearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const Search: React.FC<SearchProps> = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        //TODO: Implement search logic
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl p-0">
                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <SearchIcon className="h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search entries..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="flex-1 border-none focus:ring-0"
                            autoFocus
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {searchQuery && (
                    <div className="border-t border-gray-200 max-h-[60vh] overflow-y-auto p-4">
                        {results.length > 0 ? (
                            <div className="space-y-2">
                                {/* Render search results */}
                            </div>
                        ) : (
                            <p className="text-center text-gray-500 py-8">
                                No entries found for "{searchQuery}"
                            </p>
                        )}
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default Search;