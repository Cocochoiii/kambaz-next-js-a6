// app/Labs/Lab4/ReduxExamples/HelloRedux/index.tsx
"use client";

import { useSelector } from "react-redux";

export default function HelloRedux() {
    const { message } = useSelector((state: any) => state.helloReducer);

    return (
        <div id="wd-hello-redux">
            <h3>Hello Redux</h3>
            <h4>{message}</h4>
            <hr />
        </div>
    );
}