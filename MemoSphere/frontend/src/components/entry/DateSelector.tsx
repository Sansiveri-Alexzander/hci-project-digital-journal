import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "react-calendar"; 
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';

const StyledCalendar = styled(Calendar)`
    /* ~~~ container styles ~~~ */
    max-width: 600px;
    margin: auto;
    margin-top: 20px;
    background-color: white;
    padding: 10px;
    border-radius: 3px;

    /* ~~~ navigation styles ~~~ */
  .react-calendar__navigation {
    display: flex;

    .react-calendar__navigation__label {
      font-weight: bold;
    }

    .react-calendar__navigation__arrow {
      flex-grow: 0.333;
    }
  }

  /* ~~~ label styles ~~~ */
  .react-calendar__month-view__weekdays {
    text-align: center;
  }

  /* ~~~ button styles ~~~ */
  button {
    margin: 3px;
    background-color: white;
    border: 0;
    border-radius: 3px;
    color: black;
    padding: 5px 0;
    

    &:hover {
      background-color: #556b55;
    }

    &:active {
      background-color: #a5c1a5;
    }
  }

  /* ~~~ day grid styles ~~~ */
  .react-calendar__month-view__days {
    display: grid !important;
    grid-template-columns: 14.2% 14.2% 14.2% 14.2% 14.2% 14.2% 14.2%; 

    .react-calendar__tile {
      max-width: initial !important;
    }
  }

  /* ~~~ neighboring month & weekend styles ~~~ */
  .react-calendar__month-view__days__day--neighboringMonth {
    opacity: 0.5;
  }
  .react-calendar__month-view__days__day--weekend {
    color: red;
  }

  /* ~~~ active day styles ~~~ */
  .react-calendar__tile--range {
      outline: solid black;
      background-color: white !important;
  }

  /* ~~~ other view styles ~~~ */
  .react-calendar__year-view__months, 
  .react-calendar__decade-view__years, 
  .react-calendar__century-view__decades {
    display: grid !important;
    grid-template-columns: 20% 20% 20% 20% 20%;

    &.react-calendar__year-view__months {
      grid-template-columns: 33.3% 33.3% 33.3%;
    }

    .react-calendar__tile {
      max-width: initial !important;
    }
  }
`;

interface DateSelectorProps {
    onDateSelect: (date: Date) => void; 
  }

const DateSelector: React.FC<DateSelectorProps> = ({ onDateSelect }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        onDateSelect(date);
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
                            calendarType="gregory"
                        />
                        <div className="mt-4 flex justify-end">
                            <Button variant="outline" onClick={toggleModal} className="mr-2">
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default DateSelector;
