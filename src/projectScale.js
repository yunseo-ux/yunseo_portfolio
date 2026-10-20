// Use the midpoint of the former team and personal project scales.
export function getProjectScale(width, height) {
    const offset = Math.min(32, Math.max(16, height * .03));
    const team = Math.min(1, width / 1920, Math.max(1, height - offset * 2 - 32) / 1080);
    const personal = Math.min(1, width / 1920, height / 900);
    return (team + personal) / 2;
}
