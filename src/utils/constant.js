export const UserRolesEnum =  {
    ADMIN: "admin",
    PROJECT_ADMIN: "project_admin",
    MEMBER: "member"
}

export const AvailableUserRoles = Object.values(UserRolesEnum)

export const TaskStatusEnum = {
    IN_PROGESSS: "in_porgress",
    COMPLETED: "completed",
    TODO: "todo"
}

export const AvailableTaskStatus = Object.values(TaskStatusEnum);