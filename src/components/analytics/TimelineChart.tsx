import { useEffect, useState } from "react";
import { getTimelineAnalytics } from "../../api/analytics.api";

export default function TimelineChart({ campaignId }: { campaignId: string }) {
  const [type, setType] = useState<"OPEN" | "CLICK">("OPEN");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getTimelineAnalytics(campaignId, type).then((res) => setData(res.data));
  }, [campaignId, type]);

  return (
    <div className="bg-white border rounded p-4">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Engagement Over Time</h3>
        <select
          className="border p-1"
          value={type}
          onChange={(e) => setType(e.target.value as any)}
        >
          <option value="OPEN">Opens</option>
          <option value="CLICK">Clicks</option>
        </select>
      </div>

      {data.map((d) => (
        <div key={d.date} className="flex justify-between text-sm">
          <span>{d.date}</span>
          <span>{d.count}</span>
        </div>
      ))}
    </div>
  );
}
