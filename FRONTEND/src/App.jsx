
import { Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home/Home";
function App() {
  return <>
  <Layout>
    <Routes>
      <Route path='/' element={<Home/>}/>
    </Routes>
  </Layout>
  </>;
}

export default App;
