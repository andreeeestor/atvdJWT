import { Link } from "react-router-dom";

export default function Home(){
    return(
        <div className="homeContainer">
        <Link className="homeLinks" to={"/login"}>Entrar</Link>
        <Link className="homeLinks" to={"/register"}>Cadastrar</Link>
        </div>
    )
}