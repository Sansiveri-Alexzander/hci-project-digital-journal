import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "react-calendar"; 
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const StyledCalendar = styled(Calendar)`
  &.react-calendar {
    border: none;
    border-radius: 10px;
    background-color: #f3e5f5;
    color: #4a148c;
    font-family: Arial, sans-serif;
  }

  & .react-calendar__navigation {
    display: flex;
    justify-content: space-between;
    background-color: #7b1fa2;
    color: white;
    padding: 0.5em;
    border-radius: 10px 10px 0 0;
  }

  & .react-calendar__month-view__weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr); 
    text-align: center;
    background-color: #ce93d8;
    font-weight: bold;
    padding: 0.5em 0;
  }

  & .react-calendar__month-view__days {
    display: grid;
    grid-template-columns: repeat(7, 1fr); 
    grid-gap: 3px; 
  }

  & .react-calendar__tile {
    background: #e1bee7;
    border: 1px solid transparent;
    padding: 10px;
    margin: 3px;
    text-align: center;
    border-radius: 5px;
    font-weight: bold;
    color: #4a148c;
  }

  & .react-calendar__tile:hover {
    background: #ba68c8;
    color: white;
  }

  & .react-calendar__tile--now {
    background: #ab47bc;
    font-weight: bold;
    color: white;
  }

  & .react-calendar__tile--active {
    background: #6a1b9a;
    color: white;
  }

  & .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.7;
  }

  & .react-calendar__month-view__days__day--weekend {
    color: #dfdfdf;
  }
`;


const DateSelector = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        setIsModalOpen(false); 
    };

    return (
        <div className="mb-6 flex justify-center items-center">

            {/* Button to open modal */}
            <Button variant="outline" size="icon" className="w-full" onClick={toggleModal} title="Select Date">
                <CalendarIcon className="h-5 w-5" />
                {/* Display the selected date */}
                <p className="text-muted-foreground text-lg mr-2">
                    {selectedDate ? selectedDate.toDateString() : "Select a date"}
                </p>
            </Button>

            
            {/* Modal with calendar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Pick a Date</h3>
                        <StyledCalendar
                            onChange={handleDateChange}
                            value={selectedDate}
                        />
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={toggleModal} className="mr-2">
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default DateSelector;
