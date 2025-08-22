'use client';

interface CreateTenantProps {
    tenantCount: number;
    setTenantCount: (count: number) => void;
    tenants: Array<{
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        rent_amount: number;
        rent_due_date: number;
    }>;
    handleTenantChange: (index: number, field: string, value: string) => void;
}

export default function CreateTenant({
    tenantCount,
    setTenantCount,
    tenants,
    handleTenantChange
}: CreateTenantProps) {
    return (
        <div>
            <div className="flex gap-4 pt-2 pb-4 items-center">
                <div className="flex items-center gap-3 ml-2">
                    <label htmlFor="tenantCount" className="text-[18px] text-[#404040] font-bold whitespace-nowrap"># of Tenants</label>
                    <select 
                        id="tenantCount" 
                        value={tenantCount} 
                        onChange={e => setTenantCount(Number(e.target.value))}
                        className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD] bg-white"
                    >
                        {Array.from({ length: 101 }, (_, i) => (
                            <option key={i} value={i}>{i}</option>
                        ))}
                    </select>
                </div>
            </div>
            {tenantCount > 0 && Array.from({ length: tenantCount }, (_, index) => (
                <div key={index} className="mb-6">
                    <div className="text-lg font-semibold text-[#2A7D7B] mb-3 ml-2">Tenant #{index + 1}</div>
                    <div className="flex gap-4 pb-4">
                        <div className="flex flex-col ml-2">
                            <label htmlFor={`first_name${index}`} className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">First Name</label>
                            <input
                                type="text"
                                id={`first_name${index}`}
                                required
                                value={tenants[index]?.first_name || ''}
                                onChange={e => handleTenantChange(index, 'first_name', e.target.value)}
                                placeholder="Joaquin"
                                className="w-[150px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]"
                            />
                        </div>
                        <div className="flex flex-col ml-2">
                            <label htmlFor={`last_name${index}`} className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Last Name</label>
                            <input
                                type="text"
                                id={`last_name${index}`}
                                required
                                value={tenants[index]?.last_name || ''}
                                onChange={e => handleTenantChange(index, 'last_name', e.target.value)}
                                placeholder="Rodriguez"
                                className="w-[150px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]"
                            />
                        </div>
                        <div className="flex flex-col ml-2">
                            <label htmlFor={`email${index}`} className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Email</label>
                            <input
                                type="email"
                                id={`email${index}`}
                                value={tenants[index]?.email || ''}
                                onChange={e => handleTenantChange(index, 'email', e.target.value)}
                                placeholder="rodriguez-joaquin@comcast.net"
                                className="w-[200px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]"
                            />
                        </div>
                        <div className="flex flex-col ml-2">
                            <label htmlFor={`phone_number${index}`} className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Phone</label>
                            <input
                                type="text"
                                id={`phone_number${index}`}
                                value={tenants[index]?.phone_number || ''}
                                onChange={e => handleTenantChange(index, 'phone_number', e.target.value)}
                                placeholder="5104851584"
                                className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]"
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 pb-4">
                        <div className="flex flex-col ml-2">
                            <label htmlFor={`rent_amount${index}`} className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Rent Amount</label>
                            <input
                                type="number"
                                id={`rent_amount${index}`}
                                required
                                value={tenants[index]?.rent_amount || ''}
                                onChange={e => handleTenantChange(index, 'rent_amount', e.target.value)}
                                placeholder="$1500"
                                className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]"
                            />
                        </div>
                        <div className="flex flex-col ml-2">
                            <label htmlFor={`rent_due_date${index}`} className="text-[16px] text-[#80848A] font-semibold text-left mb-1 ml-1">Rent Due Date (day)</label>
                            <input
                                type="number"
                                max={31}
                                id={`rent_due_date${index}`}
                                required
                                value={tenants[index]?.rent_due_date || ''}
                                onChange={e => handleTenantChange(index, 'rent_due_date', e.target.value)}
                                placeholder="1"
                                className="w-[120px] h-[40px] border border-2 rounded-md px-2 focus:outline-none focus:ring-1 focus:ring-[#2A7D7B] border-[#8ABBFD]"
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

