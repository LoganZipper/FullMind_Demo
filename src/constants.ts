export enum Storage {
    DEFAULT = "DEFAULT",
    OVERDUE = "OVERDUE",
    IMPORTANT = "IMPORTANT",
    TEST = "TEST"
}

export enum List {
    DEFAULT = 1,
    OVERDUE = 2,
    IMPORTANT = 3,
    TEST = 4
}

export const LOAD_ORDER: List[] = [List.TEST, List.IMPORTANT, List.DEFAULT, List.OVERDUE]

// export const OVERDUE_LOAD_IDX: number = LOAD_ORDER.find(L => L == List.OVERDUE) || 0