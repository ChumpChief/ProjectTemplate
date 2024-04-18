import { foo1, foo2, bar1, bar2 } from "@chumpchief/package1";
import type { FC } from "react";

export const AppView: FC = () => (
    <ul>
        <li>foo1: { foo1 }</li>
        <li>foo2: { foo2 }</li>
        <li>bar1: { bar1 }</li>
        <li>bar2: { bar2 }</li>
    </ul>
);
