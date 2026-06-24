import { createContext, useState } from "react";

export const WellnessContext = createContext();

export const WellnessProvider = ({ children }) => {
  const [score, setScore] = useState(null);
  const [data, setData] = useState({});

  return (
    <WellnessContext.Provider value={{ score, setScore, data, setData }}>
      {children}
    </WellnessContext.Provider>
  );
};
