import type { FC } from "react";

import { baz } from "@chumpchief/package2";

export const AppView: FC = () => (
    <ul>
        <li>baz: { baz }</li>
    </ul>
);
