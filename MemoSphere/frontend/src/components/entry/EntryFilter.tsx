import React from 'react';
import { Button } from "@/components/ui/button";
import { FEELINGS, ACTIVITIES } from '@/components/entry/FeelingActivityModal';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, FilterX, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EntryFilterProps {
    onFilterChange: (feelings: string[], activities: string[]) => void;
    selectedFeelings: string[];
    selectedActivities: string[];
    entriesCount: number;
    filteredCount: number;
}

const EntryFilter: React.FC<EntryFilterProps> = ({
                                                     onFilterChange,
                                                     selectedFeelings,
                                                     selectedActivities,
                                                     entriesCount,
                                                     filteredCount
                                                 }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const toggleFeeling = (feelingId: string) => {
        // if feeling is already selected, remove it; otherwise add it
        const newFeelings = selectedFeelings.includes(feelingId)
            ? selectedFeelings.filter(id => id !== feelingId)
            : [...selectedFeelings, feelingId];
        onFilterChange(newFeelings, selectedActivities);
    };

    const toggleActivity = (activityId: string) => {
        const newActivities = selectedActivities.includes(activityId)
            ? selectedActivities.filter(id => id !== activityId)
            : [...selectedActivities, activityId];
        onFilterChange(selectedFeelings, newActivities);
    };

    const clearFilters = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFilterChange([], []);
    };

    const hasFilters = selectedFeelings.length > 0 || selectedActivities.length > 0;

    return (
        <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-xl border shadow-lg overflow-hidden">
            {/* collapsible wrapper for the entire filter panel */}
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-4 hover:bg-accent/5 transition-colors">
                        {/* left side with title and filter count */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-primary">
                                <SlidersHorizontal className="h-5 w-5" />
                                <h2 className="text-lg font-semibold">
                                    Filters
                                </h2>
                            </div>

                            {/* only show count badge when filters are active */}
                            {hasFilters && (
                                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full">
                  <span className="text-sm font-medium">
                    {filteredCount} of {entriesCount} entries
                  </span>
                                </div>
                            )}
                        </div>

                        {/* right side with clear button and expand/collapse icon */}
                        <div className="flex items-center gap-3">
                            <AnimatePresence>
                                {hasFilters && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                    >
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={clearFilters}
                                            className="gap-2"
                                        >
                                            <FilterX className="h-4 w-4" />
                                            Clear Filters
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                            )}
                        </div>
                    </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                    <div className="p-4 border-t space-y-4 bg-muted/30">
                        {/* Feelings Section */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-[#ed786b] flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-[#ed786b]" />
                                Feelings
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {FEELINGS.map((feeling) => (
                                    <Button
                                        key={feeling.id}
                                        variant="outline"
                                        size="sm"
                                        className={`h-9 justify-start gap-2 transition-all duration-300 hover:scale-[1.02] ${
                                            selectedFeelings.includes(feeling.id)
                                                ? 'bg-[#ed786b]/10 text-[#ed786b] border-[#ed786b] shadow-sm'
                                                : 'hover:bg-[#ed786b]/5 hover:text-[#ed786b] hover:border-[#ed786b]/30'
                                        }`}
                                        onClick={() => toggleFeeling(feeling.id)}
                                    >
                                        {feeling.icon}
                                        {feeling.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        {/* Activities Section */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-semibold text-[#752239] flex items-center gap-2">
                                <div className="h-1 w-1 rounded-full bg-[#752239]" />
                                Activities
                            </h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                                {ACTIVITIES.map((activity) => (
                                    <Button
                                        key={activity.id}
                                        variant="outline"
                                        size="sm"
                                        className={`h-9 justify-start gap-2 transition-all duration-300 hover:scale-[1.02] ${
                                            selectedActivities.includes(activity.id)
                                                ? 'bg-[#752239]/10 text-[#752239] border-[#752239] shadow-sm'
                                                : 'hover:bg-[#752239]/5 hover:text-[#752239] hover:border-[#752239]/30'
                                        }`}
                                        onClick={() => toggleActivity(activity.id)}
                                    >
                                        {activity.icon}
                                        {activity.label}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </div>
    );
};

export default EntryFilter;