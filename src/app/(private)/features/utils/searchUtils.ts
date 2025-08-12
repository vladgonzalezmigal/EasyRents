export function filterByStartsWith(list: string[], query: string): string[] {
    return list.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));
}

export function filterByIncludes(list: string[], query: string): string[] {
    return list.filter(item => item.toLowerCase().includes(query.toLowerCase()));
}