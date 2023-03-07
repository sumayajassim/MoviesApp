import { createContext } from "react";


const AppContext = createContext();

// function Context({ children }) {
//     const [isAuth, setIsAuth] = useState();
  
//     return (
//       <AppContext.Provider value={{ isAuth, setIsAuth }}>
//         {children}
//       </AppContext.Provider>
//     );
//   }

export default AppContext