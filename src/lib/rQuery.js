import { QueryClient } from "@tanstack/react-query";

if (!global.queryClient) {
    global.queryClient = new QueryClient();
}
export default global.queryClient;