export default function CalendarGrid() {

    const days = Array.from({ length: 35 });

    return (

        <div className="grid grid-cols-7 gap-3">

            {days.map((_, index) => (

                <div
                    key={index}
                    className="h-32 rounded-xl border bg-white p-3 hover:bg-gray-50"
                >

                    <div className="font-semibold">
                        {index + 1}
                    </div>

                </div>

            ))}

        </div>

    );

}