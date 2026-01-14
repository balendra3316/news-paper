export const parseSubscriberCSV = (text: string) => {
    const lines = text.split("\n").filter(Boolean);
    const headers = lines[0].split(",").map(h => h.trim());

    return lines.slice(1).map(row => {
        const values = row.split(",");
        const subscriber: any = { customFields: {} };

        headers.forEach((key, i) => {
            const value = values[i]?.trim();
            if (!value) return;

            if (key === "email") subscriber.email = value;
            else subscriber.customFields[key] = value;
        });

        return subscriber;
    });
};
