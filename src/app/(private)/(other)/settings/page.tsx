'use client';

import { sections } from '@/app/(private)/features/userSettings/utils/settingsUtils';
import GearIcon from '../../components/svgs/GearIcon'
import LineBreak from '../../features/userSettings/components/LineBreak';

export default function SettingsPage() {
 
  return (
    <div className="container px-16 py-8 max-h-screen overflow-y-auto bg-[#FAFAFA]">
        {/* Page Title  */}
        <div className="flex items-center h-[52px] w-full justify-begin mb-4">
            <GearIcon className="w-8 h-8 text-[#2F2F2F] mr-2"/>
            <h1 className="text-[32px] font-bold text-[#2F2F2F] pl-2">Settings</h1>
        </div>
        <LineBreak className="mb-6"/>
      <div className="">
        {/* Divider */}
        <div className="flex pl-2 flex-wrap gap-4">
          {sections.map((section) => (
            <a 
              key={section.id}
              href={`#${section.id}`}
              className="w-[100px] py-2 flex items-center justify-center bg-[#DFF4F3] text-[#2A7D7B] rounded-lg hover:bg-[#B6E8E4] transition-colors duration-200"
            >
              {section.title}
            </a>
          ))}
          
        </div>
        <LineBreak className="mt-7 mb-12"/>
      </div>
     {/* Main Settings Content */}
      <div className="space-y-16">
        {sections.map((section) => (
            <div key={section.id}> 
          <section 
            key={section.id} 
            id={section.id}
            className=" max-w-[900px] "
          >
            {/* Section Header */}
            <div className="flex items-center gap-4 bg-[#B6E8E4] border-2 border-[#B6E8E4] rounded-t-md py-4 w-[900px] pl-2">
              <div className="w-12 h-12 bg-[#DFF4F3] rounded-full flex items-center justify-center">
                <section.icon className="text-[#2A7D7B] w-6 h-6" />
              </div>
              <h2 className="text-2xl font-semibold text-[#4A4A4A]">{section.title}</h2>
            </div>
            {/* Settings content  */}
            <div className=" rounded-b-lg pt-8 pb-12 pl-4 bg-[#F2FBFA] shadow-sm">
                {section.content && section.content()}
            </div>
          </section>
         
          </div>
        ))}
         <LineBreak className="mt-8"/>
      </div>
    </div>
  );
}
