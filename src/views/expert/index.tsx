import { useUser } from "@/store";

function Expert() {
    const role = useUser((state) => state.role);

    return <div>{role !== "expert" ? <div>请登陆专家账号！</div> : <div>hello</div>}</div>;
}

export default Expert;
