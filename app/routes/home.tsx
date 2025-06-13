import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tech Processes" },
  ];
}

export default function Home() {
  return <Welcome />;
}
