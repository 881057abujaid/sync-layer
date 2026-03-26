import AppRoutes from "./routes";
import AppToaster from "../components/Toaster";

const App = () =>{
    return (
        <>
            <AppToaster />
            <AppRoutes />
        </>
    );
};

export default App;