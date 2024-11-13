import React from "react";
import CreateProduct from "./components/CreateProduct";
import MovementHistory from "./components/MovementHistory";
import UpdateTransport from "./components/UpdateTransport";

function App() {
  return (
    <div className="App">
      <h1>Sistema de Rastreamento de Supply Chain</h1>
      <CreateProduct />
      <UpdateTransport productId={1} />
      <MovementHistory productId={1} />
    </div>
  );
}

export default App;
