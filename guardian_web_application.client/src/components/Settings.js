import { jsx as _jsx } from "react/jsx-runtime";
const Settings = ({ title }) => {
    return (_jsx("div", { className: "relative flex w-full h-screen p-5 bg-gray-100 shadow-md lg:p-5 rounded-xl", children: _jsx("div", { className: "flex flex-col w-full h-full bg-white rounded-md shadow-md", children: _jsx("div", { className: "p-4 border-b border-gray-200", children: _jsx("h1", { className: "text-2xl font-normal text-gray-800 font-poppins", children: title }) }) }) }));
};
export default Settings;
