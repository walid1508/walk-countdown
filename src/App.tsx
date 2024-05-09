import React, { useState, useEffect } from 'react';

interface WeatherInfo {
    temp: string;
    tempF: string;
    icon: string;
}

const App: React.FC = () => {
    const [countdown, setCountdown] = useState<number>(10 * 60);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [newTime, setNewTime] = useState<string>('');
    const [weather, setWeather] = useState<WeatherInfo>({ temp: '', tempF: '', icon: '' });
    const [message, setMessage] = useState<string>('');

    useEffect(() => {
        if (countdown > 0) {
            const timerId = setInterval(() => {
                setCountdown(c => c - 1);
            }, 1000);
            return () => clearInterval(timerId);
        } else {
            setMessage("Time's Up! The course walk has ended.");
        }
    }, [countdown]);

    useEffect(() => {

        console.log(import.meta.env.USER_NAME);

        const fetchWeather = async () => {
            try {
                const response = await fetch('https://api.openweathermap.org/data/2.5/weather?q=Toronto,CA&appid=YOUR_API_KEY&units=metric');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const tempC = data.main.temp.toFixed(1);
                const tempF = (tempC * 1.8 + 32).toFixed(1);
                setWeather({
                    temp: tempC,
                    tempF: tempF,
                    icon: data.weather[0].icon
                });
            } catch (error) {
                console.error("Failed to fetch weather data:", error);
            }
        };

        fetchWeather();
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setCountdown(parseInt(newTime) * 60);
        setShowModal(false);
        setMessage(''); // Reset message when new time is set
    };

    return (
        <div className="flex flex-row items-center justify-around h-screen w-screen bg-black text-white">
            <div className="w-1/2 flex justify-center items-center">
                <img src="logo-company.png" alt="Company Logo" className="w-full max-w-4xl"/>
            </div>
            <div className="w-1/2 flex flex-col justify-center items-center text-center">
                {countdown > 0 && <p className="text-6xl md:text-7xl lg:text-7xl mb-6 antialiased">The course walk ends in:</p>}
                <h1 style={{ fontSize: countdown > 0 ? '13rem' : '6rem' }}>
                    {countdown > 0 ? `${Math.floor(countdown / 60)}:${('0' + countdown % 60).slice(-2)}` : message}
                </h1>
                <p className="text-8xl md:text-9xl lg:text-9xl text-blue-500 antialiased">
                    {weather.temp}°C / {weather.tempF}°F  <img src={`http://openweathermap.org/img/wn/${weather.icon}.png`}
                                                               alt="Weather Icon"
                                                               className="inline h-48 w-48 "/>
                </p>
            </div>
            <button className="fixed bottom-5 right-5 py-1 px-3 bg-green-700 text-white rounded-lg hover:bg-green-600"
                    onClick={() => setShowModal(true)}>
                New Time
            </button>

            {showModal && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden w-96">
                        <div className="px-6 py-4">
                            <h3 className="text-lg font-semibold text-gray-900">Set New Countdown Time</h3>
                        </div>
                        <div className="px-6 py-4">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    placeholder="Enter time in minutes"
                                    autoFocus
                                    min="1"
                                />
                                <div className="mt-4 flex justify-end">
                                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
