import { useEffect, useState } from "react";
import { getGeoAnalytics } from "../../api/analytics.api";

export default function GeoChart({ campaignId }: { campaignId: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getGeoAnalytics(campaignId).then((res) => setData(res.data));
  }, [campaignId]);

  return (
    <div className="bg-white border rounded p-4">
      <h3 className="font-semibold mb-3">Geo Engagement</h3>
      {data.map((d) => (
        <div key={d.country} className="flex items-center gap-2 mb-2">
          <div className="w-10 text-sm">{d.country}</div>
          <div className="h-3 bg-black" style={{ width: `${d.count}px` }} />
          <span className="text-sm">{d.count}</span>
        </div>
      ))}
    </div>
  );
}
