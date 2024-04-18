import { baz } from "@chumpchief/package2";
import type { FC } from "react";

export const AppView: FC = () => (
    <ul>
        <li>baz: { baz }</li>
    </ul>
);
