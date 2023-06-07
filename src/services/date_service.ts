export function getCreneauDuration(start_time: string, end_time: string): number {
    const start_date = new Date(`01/01/1970 ${start_time}`);
    const end_date = new Date(`01/01/1970 ${end_time}`);
    return (Math.abs(end_date.getTime() - start_date.getTime()) / 36e5) * 60;
}