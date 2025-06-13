import type { Route } from "./+types/home";
import {DocumentsList} from "~/components/DocumentsList";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tech Processes" },
  ];
}

export default function Home() {
  return <DocumentsList />;
}
