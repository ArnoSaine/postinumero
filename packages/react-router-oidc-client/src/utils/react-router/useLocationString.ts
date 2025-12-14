import { createPath, useLocation } from "react-router";

const useLocationString = () => createPath(useLocation());

export default useLocationString;
