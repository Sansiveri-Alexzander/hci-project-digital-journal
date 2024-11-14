// src/pages/AllEntries.tsx
import React from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export const AllEntries = () => {
    return (
        <div className="container mx-auto px-4 py-6">
            <Card>
                <CardHeader>
                    <CardTitle>All Entries</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
};