import { useEffect, useState } from "react";
import { getDeviceAnalytics } from "../../api/analytics.api";

export default function DeviceChart({ campaignId }: { campaignId: string }) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    getDeviceAnalytics(campaignId).then((res) => setData(res.data));
  }, [campaignId]);

  return (
    <div className="bg-white border rounded p-4">
      <h3 className="font-semibold mb-3">Devices</h3>
      {data.map((d) => (
        <div key={d.device_type} className="flex justify-between text-sm">
          <span>{d.device_type}</span>
          <span>{d.count}</span>
        </div>
      ))}
    </div>
  );
}
