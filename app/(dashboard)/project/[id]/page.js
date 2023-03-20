import { getUserFromCookie } from "@/lib/auth";
import { cookies } from "next/headers";
import TaskCard from "@/components/TaskCard";
import { db } from "@/lib/db";

const getData = async (id) => {
    const user = await getUserFromCookie(cookies());

    const project = await db.project.findFirst({
        where: {
            id: id,
            ownerId: user?.id
        },
        include: {
            tasks: true
        }
    });

    return project

}
export default async function ProjectPage({params}){
    //prams.id, id is from folder name [id]
    const project = await getData(params.id)

    return (
        <div className="h-full overflow-y-auto pr-6 w-1/1">
        <TaskCard tasks={project.tasks} title={project.name} />
      </div>
    )
}