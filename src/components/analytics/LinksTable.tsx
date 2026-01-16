import { useEffect, useState } from "react";
import { getCampaignLinks } from "../../api/analytics.api";

export default function LinksTable({ campaignId }: { campaignId: string }) {
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    getCampaignLinks(campaignId).then((res) => setLinks(res.data));
  }, [campaignId]);

  return (
    <div className="bg-white border rounded p-4">
      <h3 className="font-semibold mb-3">Tracked Links</h3>

      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">URL</th>
            <th className="p-2">Clicks</th>
          </tr>
        </thead>
        <tbody>
          {links
            .sort((a, b) => b.clicks - a.clicks)
            .map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2 text-sm">{l.originalUrl}</td>
                <td className="p-2 text-center">{l.clicks}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
