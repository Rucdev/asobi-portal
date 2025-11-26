interface SystemRequirement {
  item: string
  minimum: string
  recommended: string
}

interface SystemRequirementsTableProps {
  requirements: SystemRequirement[]
}

export default function SystemRequirementsTable({ requirements }: SystemRequirementsTableProps) {
  return (
    <div class="space-y-4">
      <h2 class="text-2xl font-bold border-b border-gray-700 pb-2 text-white">システム要件</h2>
      <div class="overflow-x-auto bg-gray-800 rounded-lg p-4">
        <table class="w-full text-sm text-left text-gray-400">
          <thead class="text-xs text-gray-300 uppercase bg-gray-700 rounded-t-lg">
            <tr>
              <th scope="col" class="px-6 py-3 rounded-tl-lg">
                項目
              </th>
              <th scope="col" class="px-6 py-3">
                最小 (Minimum)
              </th>
              <th scope="col" class="px-6 py-3 rounded-tr-lg">
                推奨 (Recommended)
              </th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((req, index) => (
              <tr
                class={`bg-gray-800 ${index !== requirements.length - 1 ? 'border-b border-gray-700' : ''}`}
              >
                <th scope="row" class="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {req.item}
                </th>
                <td class="px-6 py-4">{req.minimum}</td>
                <td class="px-6 py-4">{req.recommended}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
