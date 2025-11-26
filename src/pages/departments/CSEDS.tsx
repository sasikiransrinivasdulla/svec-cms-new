
import React, { useState } from 'react';
import { Cpu, BookOpen, Award, ExternalLink, Menu, ChevronRight, Users, Briefcase, FileText, Activity, Shield, Rss, Calendar, Phone, HardHat, Microscope, Search, Download, Wifi, TrendingUp, Presentation, Trophy, Handshake, Scroll, Building, Library, Link as LinkIcon } from 'lucide-react';
import { DepartmentSidebar } from '@/components/DepartmentSidebar';

type Doc = { id: number; academic_year: string; title: string; file_url: string };
type Image = { id: number; image_url: string; alt_text: string };
type Gallery = { id: number; title: string; images: Image[] };
const CSTDepartment: React.FC = () => {
      const [sidebarOpen, setSidebarOpen] = useState(false);
      const [activeContent, setActiveContent] = useState('Department Profile');
      const [activeDeptTab, setActiveDeptTab] = useState('Department');
      const [settingsPanelOpen, setSettingsPanelOpen] = useState(false);
      const [faculty, setFaculty] = React.useState<any[]>([]);
      const [TechnicalFaculty, setTechnicalFaculty] = React.useState<any[]>([]);
      const [nonTeachingFaculty, setNonTeachingFaculty] = React.useState<any[]>([]);
        const [boardOfStudies, setBoardOfStudies] = useState<any[]>([]);
        const [loadingBOS, setLoadingBOS] = useState(true);
        const [bosError, setBOSError] = useState<string | null>(null);
        const [bosmeetings, setBosMeetings] = useState<any[]>([]);
        const [syllabus, setSyllabus] = React.useState<any[]>([]);
        const [mous, setMous] = React.useState<any[]>([]);
        const [fdp, setFdp] = React.useState<any[]>([]);
        const [data, setData] = React.useState<any[]>([]);
        const [workshopsdata,setWorkshops]=React.useState<
            { title: string; items: { text: string; url: string }[] }[]
          >([]);
        const [studentAchievements, setStudentAchievements] = React.useState<any[]>([]);
         const [placements, setPlacements] = React.useState<any[]>([]);
          const [academicToppers, setAcademicToppers] = React.useState<{
             dept?: string;
             batches?: any[];
             stats?: any[];
           }>({});
           const batches = academicToppers.batches ?? [];
           const stats   = academicToppers.stats ?? [];
          const [acdemictoppersgal,setAcademicToppersGal] = React.useState<{galleries: Gallery[]}>({galleries: []});
          const [technicalAssociation, setTechnicalAssociation] = React.useState<any[]>([]);
          const [extra, setExtra] = React.useState<{documents:any[]; clubs:any[]}>({documents:[], clubs:[]});
            const [hackathons, setHackathons] = React.useState<{documents: Doc[]; galleries: Gallery[]}>({documents: [], galleries: []});
            const [handbooks, setHandbooks] = React.useState<any[]>([]);
            const [overview, setOverview] = React.useState<any>(null);
            // Comprehensive Promise.all data fetching for CSE-DS department
            React.useEffect(() => {
              const fetchAllData = async () => {
                try {
                  const [
                    overviewResponse,
                    handbooksResponse,
                    hackathonsResponse,
                    extraCurricularResponse,
                    technicalAssociationResponse,
                    academicToppersGalleryResponse,
                    academicToppersResponse,
                    placementsResponse,
                    studentAchievementsResponse,
                    workshopsResponse,
                    facultyAchievementsResponse,
                    facultyDevelopmentResponse,
                    mousResponse,
                    syllabusResponse,
                    bosMinutesResponse,
                    bosStudiesResponse,
                    facultyResponse,
                    technicalFacultyResponse,
                    nonTeachingStaffResponse,
                    publicDeptResponse
                  ] = await Promise.allSettled([
                    fetch('/api/cds/ds-department-overview').then(res => res.json()).catch(() => null),
                    fetch('/api/cds/ds-handbooks').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-hackathons').then(res => res.json()).catch(() => ({ documents: [], galleries: [] })),
                    fetch('/api/cds/ds-extra-curricular').then(res => res.json()).catch(() => ({ documents: [], clubs: [] })),
                    fetch('/api/cds/ds-technical-association').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-academic-toppers-gallery').then(res => res.json()).catch(() => ({ galleries: [] })),
                    fetch('/api/cds/ds-academic-toppers').then(res => res.json()).catch(() => ({})),
                    fetch('/api/cds/ds-placements').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-student-achievements').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-workshops').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-faculty-achievements').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-faculty-development').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-mous').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-syllabus').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-bos-minutes').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-bos-members').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-faculty').then(res => res.json()).catch(() => []),
                    fetch('/api/cds/ds-technical-faculty').then(res => res.json()).catch(() => ({ technical: [] })),
                    fetch('/api/cds/ds-non-teaching-staff').then(res => res.json()).catch(() => ({ nonTeaching: [] })),
                    fetch('/api/public/departments/cse-ds').then(res => res.json()).catch(() => ({ success: false, data: {} }))
                  ]);

                  // Handle all responses with proper error checking
                  if (overviewResponse.status === 'fulfilled') {
                    setOverview(overviewResponse.value);
                  }

                  if (handbooksResponse.status === 'fulfilled') {
                    setHandbooks(Array.isArray(handbooksResponse.value) ? handbooksResponse.value : []);
                  }

                  if (hackathonsResponse.status === 'fulfilled') {
                    setHackathons(hackathonsResponse.value || { documents: [], galleries: [] });
                  }

                  if (extraCurricularResponse.status === 'fulfilled') {
                    setExtra(extraCurricularResponse.value || { documents: [], clubs: [] });
                  }

                  if (technicalAssociationResponse.status === 'fulfilled') {
                    setTechnicalAssociation(Array.isArray(technicalAssociationResponse.value) ? technicalAssociationResponse.value : []);
                  }

                  if (academicToppersGalleryResponse.status === 'fulfilled') {
                    setAcademicToppersGal(academicToppersGalleryResponse.value || { galleries: [] });
                  }

                  if (academicToppersResponse.status === 'fulfilled') {
                    setAcademicToppers(academicToppersResponse.value || {});
                  }

                  if (placementsResponse.status === 'fulfilled') {
                    setPlacements(Array.isArray(placementsResponse.value) ? placementsResponse.value : []);
                  }

                  if (studentAchievementsResponse.status === 'fulfilled') {
                    setStudentAchievements(Array.isArray(studentAchievementsResponse.value) ? studentAchievementsResponse.value : []);
                  }

                  if (workshopsResponse.status === 'fulfilled') {
                    setWorkshops(Array.isArray(workshopsResponse.value) ? workshopsResponse.value : []);
                  }

                  if (facultyAchievementsResponse.status === 'fulfilled') {
                    setData(Array.isArray(facultyAchievementsResponse.value) ? facultyAchievementsResponse.value : []);
                  }

                  if (facultyDevelopmentResponse.status === 'fulfilled') {
                    setFdp(Array.isArray(facultyDevelopmentResponse.value) ? facultyDevelopmentResponse.value : []);
                  }

                  if (mousResponse.status === 'fulfilled') {
                    setMous(Array.isArray(mousResponse.value) ? mousResponse.value : []);
                  }

                  if (syllabusResponse.status === 'fulfilled') {
                    setSyllabus(Array.isArray(syllabusResponse.value) ? syllabusResponse.value : []);
                  }

                  if (bosMinutesResponse.status === 'fulfilled') {
                    setBosMeetings(Array.isArray(bosMinutesResponse.value) ? bosMinutesResponse.value : []);
                  }

                  if (bosStudiesResponse.status === 'fulfilled') {
                    setBoardOfStudies(Array.isArray(bosStudiesResponse.value) ? bosStudiesResponse.value : []);
                    setLoadingBOS(false);
                    setBOSError(null);
                  } else {
                    setLoadingBOS(false);
                    setBOSError('Failed to fetch Board of Studies');
                  }

                  if (facultyResponse.status === 'fulfilled') {
                    setFaculty(Array.isArray(facultyResponse.value) ? facultyResponse.value : []);
                  }

                  if (technicalFacultyResponse.status === 'fulfilled') {
                    const techData = technicalFacultyResponse.value;
                    // Handle both array format and object with 'technical' property
                    setTechnicalFaculty(Array.isArray(techData) ? techData : Array.isArray(techData?.technical) ? techData.technical : []);
                  }

                  if (nonTeachingStaffResponse.status === 'fulfilled') {
                    const staffData = nonTeachingStaffResponse.value;
                    // Handle both array format and object with 'nonTeaching' property
                    setNonTeachingFaculty(Array.isArray(staffData) ? staffData : Array.isArray(staffData?.nonTeaching) ? staffData.nonTeaching : []);
                  }

                  // Handle public department API data as fallback
                  if (publicDeptResponse.status === 'fulfilled' && publicDeptResponse.value) {
                    const publicData = publicDeptResponse.value?.data || {};
                    console.log('🔍 CSE-DS Public Department API data available:', Object.keys(publicData));
                    // Use public data as fallback for any missing data if needed
                  }

                  console.log('✅ CSE-DS department data fetch completed');

                } catch (error) {
                  console.error('❌ Error fetching CSE-DS department data:', error);
                  setLoadingBOS(false);
                  setBOSError('Failed to fetch data');
                }
              };

              fetchAllData();
            }, []);

  const sidebarItems = [
    { id: 'Department Profile', label: 'Department Profile', icon: <Building className="w-4 h-4" /> },
    { id: 'Faculty Profiles', label: 'Faculty Profiles', icon: <Users className="w-4 h-4" /> },
    { id: 'Board of Studies', label: 'Board of Studies', icon: <Award className="w-4 h-4" /> },
    { id: 'Syllabus', label: 'Syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'Physical Facilities', label: 'Physical Facilities', icon: <HardHat className="w-4 h-4" /> },
    { id: 'MoUs', label: 'MoUs', icon: <Handshake className="w-4 h-4" /> },
    { id: 'Faculty Development Programs', label: 'Faculty Development Programs', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'Faculty Achievements', label: 'Faculty Achievements', icon: <Trophy className="w-4 h-4" /> },
    { id: 'Workshops', label: 'Workshops', icon: <Presentation className="w-4 h-4" /> },
    { id: 'Student Achievements', label: 'Student Achievements', icon: <Award className="w-4 h-4" /> },
    { id: 'Placements', label: 'Placements', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'Merit Scholarship/Academic Toppers', label: 'Merit Scholarship/Academic Toppers', icon: <Trophy className="w-4 h-4" /> },
    { id: 'Technical Association', label: 'Technical Association', icon: <Cpu className="w-4 h-4" /> },
    { id: 'Extra-Curricular Activities', label: 'Extra-Curricular Activities', icon: <Activity className="w-4 h-4" /> },
    { id: 'Hackathons', label: 'Hackathons', icon: <Cpu className="w-4 h-4" /> },
    { id: 'Handbooks', label: 'Handbooks', icon: <FileText className="w-4 h-4" /> },
    { id: 'Contact', label: 'Contact', icon: <Phone className="w-4 h-4" /> }
  ];

  const sections = ['Department', 'Vision', 'Mission', 'PEOs', 'POs', 'PSOs', 'COs', 'SalientFeatures'];

  const renderDeptTabContent = () => {
    switch (activeDeptTab) {
      
      case 'Department Profile':
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
      <div className="space-y-8">
        {/* Desktop Navigation Tabs */}
        <div className="hidden md:block relative mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {sections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveDeptTab(section)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeDeptTab === section
                  ? 'bg-[#B22222] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {section === 'SalientFeatures' ? 'Salient Features' : section}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Section Display */}
        <div className="md:hidden relative mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Current Section: <span className="text-[#B22222]">{activeDeptTab === 'SalientFeatures' ? 'Salient Features' : activeDeptTab}</span>
            </h3>
            <p className="text-sm text-gray-600 mt-2">Use the floating settings button to navigate between sections</p>
          </div>
        </div>

        {/* Department Overview (Dynamic) */}
        {activeDeptTab === 'Department' && (
          !overview ? (
            <div className="text-center text-gray-600">Loading...</div>
          ) : (
            <div className="flex flex-col md:flex-row items-center gap-8 mb-8 animate-fade-in">
              <div className="md:w-1/3">
                <img
                  src={overview.hod_image_url}
                  alt={overview.hod_name}
                  className="w-full h-auto object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="md:w-2/3">
                <h3 className="text-xl font-bold text-[#B22222] mb-2">{overview.hod_name}</h3>
                <p className="text-gray-700 mb-2">{overview.hod_qualification}</p>
                <p className="text-gray-700 mb-2">
                  <a href={`mailto:${overview.hod_email}`} className="text-[#B22222] hover:underline">{overview.hod_email}</a>
                </p>
                <p className="text-gray-700 text-lg text-justify">{overview.description}</p>
              </div>
            </div>
          )
        )}

        {/* Game-Style Right Side Settings Panel */}
        {settingsPanelOpen && (
          <div className="fixed inset-0 z-50">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
              onClick={() => setSettingsPanelOpen(false)}
            ></div>
            {/* Settings Panel */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-80 md:w-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl transform transition-transform duration-500 ease-out">
              {/* Panel Header */}
              <div className="bg-gradient-to-r from-[#B22222] to-[#B22222] p-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg">Department Navigation</h3>
                      <p className="text-white/70 text-sm">Select a section to explore</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSettingsPanelOpen(false)}
                    className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              {/* Panel Content */}
              <div className="p-6 h-full overflow-y-auto">
                <div className="space-y-3">
                  {sections.map((section, index) => {
                    const isActive = section === activeDeptTab;
                    return (
                      <button
                        key={section}
                        onClick={() => {
                          setActiveDeptTab(section);
                          setSettingsPanelOpen(false);
                        }}
                        className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive
                          ? 'bg-gradient-to-r from-[#B22222] to-[#B22222] text-white shadow-lg scale-105'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isActive ? 'bg-white/20' : 'bg-gray-600'
                            }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-semibold">
                              {section === 'SalientFeatures' ? 'Salient Features' : section}
                            </div>
                            <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                              {section === 'Department' && 'Overview & HOD Profile'}
                              {section === 'Vision' && 'Department Vision Statement'}
                              {section === 'Mission' && 'Department Mission Statement'}
                              {section === 'PEOs' && 'Program Educational Objectives'}
                              {section === 'POs' && 'Program Outcomes'}
                              {section === 'PSOs' && 'Program Specific Outcomes'}
                              {section === 'COs' && 'Course Outcomes'}
                              {section === 'SalientFeatures' && 'Key Highlights & Features'}
                            </div>
                          </div>
                          {isActive && (
                            <div className="ml-auto">
                              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
                {/* Panel Footer */}
                <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                  <div className="text-center">
                    <div className="text-white/70 text-sm mb-2">Quick Navigation</div>
                    <div className="text-white/50 text-xs">
                      Click any section above to navigate instantly
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Floating Settings Button - Mobile Only */}
        <button
          onClick={() => setSettingsPanelOpen(true)}
          className="md:hidden fixed right-3 bottom-6 z-40 w-12 h-12 bg-gradient-to-br from-[#B22222] to-[#B22222] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
          title="Department Navigation"
        >
          <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {/* Mobile Label */}
          <div className="absolute bottom-14 right-0 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Menu
            <div className="absolute top-full right-2 w-0 h-0 border-t-4 border-t-gray-900 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
          </div>
        </button>

        {/* Tab Content */}
        <div>
          {renderDeptTabContent()}
        </div>
      </div>
    </div>
  );
  
      case 'Vision':
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Vision</h3>
            <p className="text-gray-700">
              To evolve as a centre of academic and research excellence in the
                area of Computer Science and Engineering(Data Science).
            </p>
          </div>
        );
      case 'Mission':
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Mission</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              
              <li>To utilize innovative learning methods for academic
                improvement.</li>
              <li>To encourage higher studies and research to meet the
                futuristic requirements of Computer Science and
                Engineering(Artificial Intelligence).</li>
              <li>To inculcate Ethics and
                Human values for developing students with good character.</li>
            </ul>
          </div>
        );
      case 'PEOs':
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Program Educational Objectives (PEOs)</h3>
            <p className="text-gray-700 mb-4">	CSE(Data Science)	Graduates of this programme will be able to :</p>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-800">PEO 1</h4>
                <p className="text-gray-700">Adapt to evolving technology.</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-800">PEO 2</h4>
                <p className="text-gray-700">Provide optimal soultions to real time problems.

                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-blue-800">PEO 3</h4>
                <p className="text-gray-700">Demonstrate his/her abilities to support service activities with due consideration for Professional and Ethical values.</p>
              </div>
              
            </div>
          </div>
        );
      case 'POs':
          return (
            <div className="animate-fade-in">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Program Outcomes (POs)</h3>
              <div className="pl-5 space-y-3 text-gray-700 text-justify">
                <ol className="list-decimal pl-6">
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Engineering knowledge:</strong>
                    Apply the knowledge of Mathematics, Science, Engineering Fundamentals, and Concepts of Computer Science Engineering to the solution of complex Engineering problems. [K3]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Problem Analysis:</strong>
                    Identify, formulate, review research literature, and analyze complex engineering problems reaching substantiated conclusions using first principles of Mathematics, Natural Sciences, and Computer Science. [K4]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Design/development of solutions:</strong>
                    Design solutions for complex engineering problems and design system components or processes that meet the specific needs with appropriate consideration for public health and safety, and the cultural, societal, and environmental considerations. [K5]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Conduct investigations of complex problems:</strong>
                    Use research-based knowledge and research methods, including the design of experiments, analysis and interpretation of data, and synthesis of information to provide valid conclusions. [K5]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Modern tool usage:</strong>
                    Create, select, and apply appropriate techniques, resources, and modern engineering and IT tools, including prediction and modeling, to complex Engineering activities with an understanding of the limitations. [K3]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>The engineer and society:</strong>
                    Apply reasoning informed by contextual knowledge to assess societal, health, safety, legal, and cultural issues and the consequent responsibilities relevant to professional Engineering practice. [K3]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Environment and sustainability:</strong>
                    Understand the impact of professional engineering solutions in societal and environmental contexts and demonstrate knowledge of, and the need for sustainable development. [K3]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Ethics:</strong>
                    Apply ethical principles and commit to professional ethics and responsibilities and norms of Engineering practice. [K3]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Individual and team work:</strong>
                    Function effectively as an individual and as a member or leader in diverse teams and in multidisciplinary settings. [K6]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Communication:</strong>
                    Communicate effectively on complex Engineering activities with the Engineering community and with society at large, such as being able to comprehend and write effective reports and design documentation, make effective presentations, and give and receive clear instructions. [K2]
                  </li>
                  <li style={{marginBottom: '10px'}}>
                    <strong style={{color: '#B22222'}}>Project management and finance:</strong>
                    Demonstrate knowledge and understanding of Engineering and Management principles and apply these to one's own work, as a member and leader in a team, to manage projects and in multidisciplinary environments. [K6]
                  </li>
                  <li>
                    <strong style={{color: '#B22222'}}>Life-long learning:</strong>
                    Recognize the need for, and have the preparation and ability to engage in independent and life-long learning in the broadest context of technological change. [K1]
                  </li>
                </ol>
              </div>
            </div>
          );
      case 'PSOs':
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Program Specific Outcomes (PSOs)</h3>
            <p className="text-gray-700 mb-4">A graduate of the CSE(Artificial Intelligence)
                Programme will be able to:</p>
            <div className="pl-5 space-y-3 text-gray-700 text-justify">
              <ol className="list-decimal pl-6">
                <li style={{marginBottom: '10px'}}>
                  <span className="font-semibold" style={{color: '#B22222'}}>PSO1:</span> Use Mathematical Abstractions and Algorithmic Design along with Open Source Programming tools to solve complexities involved in Programming. <span style={{fontWeight: 'bold'}}>[K3]</span>
                </li>
                <li style={{marginBottom: '10px'}}>
                  <span className="font-semibold" style={{color: '#B22222'}}>PSO2:</span> Use Professional Engineering practices and strategies for development and maintenance of software. <span style={{fontWeight: 'bold'}}>[K3]</span>
                </li>
              </ol>
            </div>
          </div>
        );
      case 'COs':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Course Outcomes (COs)</h3>
            <p className="text-gray-700 mb-4">
              The course outcomes for all courses offered by the Computer Science & Technology department are designed to align with program outcomes and educational objectives.
            </p>
            <div className="space-y-4">
              <div>
                <span className="font-semibold text-gray-800">Course Outcomes (V23 Regulation)</span>
                <a
                  href="https://srivasaviengg.ac.in/uploads/cst/Course%20Outcomes%20-V23%20Regulation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 inline-block px-4 py-2 bg-[#B22222] text-white rounded hover:bg-[#A01E1E] transition-colors duration-300 view-button"
                  style={{fontSize: '16px'}}
                >
                  View PDF
                </a>
              </div>
              <div>
                <span className="font-semibold text-gray-800">Course Outcomes (V20 Regulation)</span>
                <a
                  href="https://srivasaviengg.ac.in/uploads/cse_extra_activities/Course%20Outcomes%20-V20%20Regulation.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-3 inline-block px-4 py-2 bg-[#B22222] text-white rounded hover:bg-[#A01E1E] transition-colors duration-300 view-button"
                  style={{fontSize: '16px'}}
                >
                  View PDF
                </a>
              </div>
              
            </div>
          </div>
        );
      case 'SalientFeatures':
        return (
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Salient Features</h3>
            <ul className="pl-5 space-y-3 text-gray-700">
              <li><strong className="text-[#B22222]">➟</strong> All Class Rooms are ICT enabled.</li>
              <li><strong className="text-[#B22222]">➟</strong> MoUs with NIT ANP , Eduskills , Hexaware , APSSDC , Alykas
                    Innovations Pvt.Ltd, thingTronics Pvt Ltd,Bangalore and
                    TCS-iON.</li>
              <li><strong className="text-[#B22222]">➟</strong> College has MOU with TCS for conducting Online Competitive Exams for which our Department Resources are being utilized.</li>
              <li><strong className="text-[#B22222]">➟</strong> Professional Society memberships in ISTE and IAENG.</li>
              <li><strong className="text-[#B22222]">➟</strong> Good faculty retention.</li>
              <li><strong className="text-[#B22222]">➟</strong> Well Equipped Laboratories.</li>
              <li><strong className="text-[#B22222]">➟</strong> Sahaya, Social Service Unit, managed by the Students.</li>
            </ul>
          </div>
        );
      default:
        return (
          <div className="animate-fade-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Department Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              The Department of CSE-Data Science was established in 2019. The department offers undergraduate program in CSE-Data Science with an intake of 60 students.
            </p>
          </div>
        );
    }
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'Department Profile':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <div className="space-y-8">
              {/* Desktop Navigation Tabs */}
              <div className="hidden md:block relative mb-8">
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {sections.map((section) => (
                    <button
                      key={section}
                      onClick={() => setActiveDeptTab(section)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${activeDeptTab === section
                          ? 'bg-[#B22222] text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                      {section === 'SalientFeatures' ? 'Salient Features' : section}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Section Display */}
              <div className="md:hidden relative mb-8">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Current Section: <span className="text-[#B22222]">{activeDeptTab === 'SalientFeatures' ? 'Salient Features' : activeDeptTab}</span>
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">Use the floating settings button to navigate between sections</p>
                </div>
              </div>

              {/* Game-Style Right Side Settings Panel */}
              {settingsPanelOpen && (
                <div className="fixed inset-0 z-50">
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
                    onClick={() => setSettingsPanelOpen(false)}
                  ></div>

                  {/* Settings Panel */}
                  <div className="fixed right-0 top-0 h-full w-full sm:w-80 md:w-96 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl transform transition-transform duration-500 ease-out">
                    {/* Panel Header */}
                    <div className="bg-gradient-to-r from-[#B22222] to-[#8B0000] p-4 border-b border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-white font-bold text-lg">Department Navigation</h3>
                            <p className="text-white/70 text-sm">Select a section to explore</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSettingsPanelOpen(false)}
                          className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
                        >
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Panel Content */}
                    <div className="p-6 h-full overflow-y-auto">
                      <div className="space-y-3">
                        {sections.map((section, index) => {
                          const isActive = section === activeDeptTab;
                          return (
                            <button
                              key={section}
                              onClick={() => {
                                setActiveDeptTab(section);
                                setSettingsPanelOpen(false);
                              }}
                              className={`w-full text-left p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${isActive
                                  ? 'bg-gradient-to-r from-[#B22222] to-[#8B0000] text-white shadow-lg scale-105'
                                  : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                                }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${isActive ? 'bg-white/20' : 'bg-gray-600'
                                  }`}>
                                  {index + 1}
                                </div>
                                <div>
                                  <div className="font-semibold">
                                    {section === 'SalientFeatures' ? 'Salient Features' : section}
                                  </div>
                                  <div className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                                    {section === 'Department' && 'Overview & HOD Profile'}
                                    {section === 'Vision' && 'Department Vision Statement'}
                                    {section === 'Mission' && 'Department Mission Statement'}
                                    {section === 'PEOs' && 'Program Educational Objectives'}
                                    {section === 'POs' && 'Program Outcomes'}
                                    {section === 'PSOs' && 'Program Specific Outcomes'}
                                    {section === 'COs' && 'Course Outcomes'}
                                    {section === 'SalientFeatures' && 'Key Highlights & Features'}
                                  </div>
                                </div>
                                {isActive && (
                                  <div className="ml-auto">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Panel Footer */}
                      <div className="mt-8 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                        <div className="text-center">
                          <div className="text-white/70 text-sm mb-2">Quick Navigation</div>
                          <div className="text-white/50 text-xs">
                            Click any section above to navigate instantly
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Settings Button - Mobile Only */}
              <button
                onClick={() => setSettingsPanelOpen(true)}
                className="md:hidden fixed right-3 bottom-6 z-40 w-12 h-12 bg-gradient-to-br from-[#B22222] to-[#8B0000] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 flex items-center justify-center group"
                title="Department Navigation"
              >
                <svg className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                {/* Mobile Label */}
                <div className="absolute bottom-14 right-0 bg-gray-900 text-white px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  Menu
                  <div className="absolute top-full right-2 w-0 h-0 border-t-4 border-t-gray-900 border-l-2 border-r-2 border-l-transparent border-r-transparent"></div>
                </div>
              </button>

              {/* Tab Content */}
              <div>
                {renderDeptTabContent()}
              </div>
            </div>
          </div>
        );
      case 'Student Achievements':
        const groupedStudentAchievements = studentAchievements.map((section, idx) => ({
          category: section.title,
          items: section.items || []
        }));

        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Student Achievements</h2>
            <div className="space-y-6">
              {groupedStudentAchievements.map((group, index) => (
                <details key={group.category} open={index === 0} className="cst-dropdown">
                  <summary>{group.category}</summary>
                  <div className="cst-dropdown-content">
                    {group.items.length > 0 ? (
                      <ul className="list-disc pl-6 my-2 space-y-2">
                        {group.items.map((item: any, idx: number) => (
                          <li key={idx}>
                            {item.text}
                            {item.url && (
                              <>
                                {' - '}
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#B22222] hover:underline"
                                >
                                  View
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-600 text-sm mt-2">No entries available currently.</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        );

      case 'Syllabus':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Syllabus</h2>
  <div className="container mx-auto">
    {syllabus.length === 0 ? (
      <div className="text-center text-gray-500">No syllabus data available.</div>
    ) : (
      // Group syllabus items by category to create collapsible sections
      Object.entries(
        syllabus.reduce((groups, item) => {
          const cat = item.category || "Others";
          if (!groups[cat]) groups[cat] = [];
          groups[cat].push(item);
          return groups;
        }, {} as Record<string, any[]>)
      ).map(([category, items]) => (
        <div className="section" key={category}>
          <details open={category.toLowerCase().includes("b.tech")}>
            <summary className="font-semibold text-lg">{category}</summary>
            <div className="nav-content p-3">
              <ul className="list-disc list-inside my-0">
                {(items as any[]).map((item, idx) => (
                  <li className="m-0 p-0" key={item.id}>
                    {item.title} –
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B22222] hover:underline ml-2"
                    >
                      View
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </div>
      ))
    )}
            </div>
          </div>
        );

      case 'Faculty Profiles':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Faculty Profiles</h2>
            <div className="space-y-6">
              <details open className="cst-dropdown">
                <summary>Teaching Faculty</summary>
                <div className="cst-dropdown-content">
                  {faculty && faculty.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 border border-gray-200 rounded-lg">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">S.No.</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Name</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Qualification</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Designation</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Profile</th>
                          </tr>
                        </thead>
                        <tbody>
                          {faculty.map((member, index) => (
                            <tr key={member.id || index} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{member.name || 'N/A'}</td>
                              <td className="px-6 py-4">{member.qualification || 'N/A'}</td>
                              <td className="px-6 py-4">{member.designation || 'N/A'}</td>
                              <td className="px-6 py-4">
                                <a 
                                  href={member.profile_url || '#'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1 bg-[#B22222] text-white rounded hover:bg-[#A01E1E] transition-colors duration-200 text-sm font-medium inline-block"
                                >
                                  View Profile
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500">
                        {faculty ? 'No teaching faculty data available.' : 'Loading teaching faculty...'}
                      </div>
                    </div>
                  )}
                </div>
              </details>

              <details className="cst-dropdown">
                <summary>Technical Staff</summary>
                <div className="cst-dropdown-content">
                  {TechnicalFaculty && TechnicalFaculty.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 border border-gray-200 rounded-lg">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">S.No.</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Name</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Designation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {TechnicalFaculty.map((member, index) => (
                            <tr key={member.id || index} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{member.name || 'N/A'}</td>
                              <td className="px-6 py-4">{member.designation || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500">
                        {TechnicalFaculty ? 'No technical staff data available.' : 'Loading technical staff...'}
                      </div>
                    </div>
                  )}
                </div>
              </details>

              <details className="cst-dropdown">
                <summary>Non-Teaching Staff</summary>
                <div className="cst-dropdown-content">
                  {nonTeachingFaculty && nonTeachingFaculty.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left text-gray-500 border border-gray-200 rounded-lg">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">S.No.</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Name</th>
                            <th scope="col" className="px-6 py-3 border-b border-gray-200">Designation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {nonTeachingFaculty.map((member, index) => (
                            <tr key={member.id || index} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
                              <td className="px-6 py-4">{index + 1}</td>
                              <td className="px-6 py-4 font-medium text-gray-900">{member.name || 'N/A'}</td>
                              <td className="px-6 py-4">{member.designation || 'N/A'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-gray-500">
                        {nonTeachingFaculty ? 'No non-teaching staff data available.' : 'Loading non-teaching staff...'}
                      </div>
                    </div>
                  )}
                </div>
              </details>
            </div>
          </div>
        );


            case 'Board of Studies':
            return (
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
              <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Board of Studies</h2>
              <div className="overflow-x-auto">
                {loadingBOS ? (
                  <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : bosError ? (
                  <div className="text-center py-8 text-red-500">{bosError}</div>
                ) : (
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3">S.No</th>
                        <th scope="col" className="px-6 py-3">Name</th>
                        <th scope="col" className="px-6 py-3">Designation</th>
                        <th scope="col" className="px-6 py-3">Organization</th>
                        <th scope="col" className="px-6 py-3">Position</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardOfStudies.map((member, index) => (
                        <tr key={index} className="bg-white border-b hover:bg-gray-50">
                          <td className="px-6 py-4">{index + 1}</td>
                          <td className="px-6 py-4 font-medium text-gray-900">{member.member_name}</td>
                          <td className="px-6 py-4">{member.designation}</td>
                          <td className="px-6 py-4">{member.organization}</td>
                          <td className="px-6 py-4">{member.role}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            

            <div className="mt-4">
              <div className="flex flex-col justify-center items-center mb-5">
                <h4 className="text-xl font-semibold text-[#B22222] mb-4">Board of Studies Meeting Minutes:</h4>
                <ul className="my-2 space-y-3 list-none">
                  {bosmeetings.map((item, idx) => (
                    <li key={idx} className="text-center">
                      {item.meeting_title} –{" "}
                      <a
                        href={item.document_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#B22222] hover:underline ml-2"
                      >
                        View
                      </a>
                    </li>
                  ))}
                 </ul>
              </div>
            </div>
            </div>
        );


        

      case 'MoUs':
        return (
          <div id="mous" className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
                <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">MoUs</h2>
                <h3 className="text-xl font-semibold text-center mb-4">A. MOUs with Industries</h3>

                <div className="overflow-x-auto flex justify-center">
                  <table className="min-w-max bg-white border border-gray-200 table-auto text-sm text-left text-gray-500">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="py-3 px-4 border-b">S.No</th>
                        <th className="py-3 px-4 border-b">Organization Name</th>
                        <th className="py-3 px-4 border-b">From</th>
                        <th className="py-3 px-4 border-b">To</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mous.map((mou: any, index: number) => (
                        <tr key={mou.id ?? index}>
                          <td className="py-3 px-4 border-b">{index + 1}</td>
                          <td className="py-3 px-4 border-b">{mou.organization_name}</td>
                          <td className="py-3 px-4 border-b">
                            {new Date(mou.start_date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="py-3 px-4 border-b">
                            {mou.end_date
                              ? new Date(mou.end_date).toLocaleDateString("en-GB")
                              : "Till Date"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
          </div>
        );
      case 'Physical Facilities':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Physical Facilities</h2>

            <div className="space-y-6">
              <details open className="border rounded-lg p-4">
                <summary className="text-lg font-semibold cursor-pointer">Class Rooms</summary>
                <div className="mt-3 space-y-3">
                  <div>
                    <h5 className="text-md font-semibold mb-2">Class Rooms</h5>
                    <ul className="list-disc pl-6 my-2">
                      <li>
                        Class Rooms with ICT Enabled Facilities -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cse_extra_activities/CSE_Classrooms.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-md font-semibold mb-2">Class Time Tables</h5>
                    <ul className="list-disc pl-6 my-2 space-y-2">
                      <li>
                        Master Timetable A.Y for Sem-I 2025-26 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/Master Time Table_2025-26_ III, V, VII SEM _CST.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-II 2024-25 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/CST_Master%20Time%20Table_2024-25_%20II%20SEM%20_CST%20(1).pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-I 2024-25 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/CST_Master%20Timetable_A.Y%20for%20Sem-I%202024-25.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-II 2023-24 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/CST_Master%20Time%20Table_2023-24_%20II%20SEM%20_CST.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-I 2023-24 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/Master Time Table_2022-23_ III, V, VII SEM _CST.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-I 2022-23 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/Master Time Table_2022-23_ III, V, VII SEM _CST.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-II 2023-24 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/uploads/cst/CST_Master Time Table_2022-23_ II SEM _CST.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-I 2022-23 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/CST_Master Time Table_A.Y. 2022-23_ I SEM.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-II 2021-22 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/Master Time Table _CST_II SEM_A.Y 2021-22.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                      <li>
                        Master Timetable A.Y for Sem-I 2021-22 -{' '}
                        <a
                          href="https://srivasaviengg.ac.in/uploads/cst/Master Time Table _CST_I SEM_A.Y 2021-22.pdf"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B22222] hover:underline"
                        >
                          View
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </details>

              <details className="border rounded-lg p-4">
                <summary className="text-lg font-semibold cursor-pointer">Seminar Halls</summary>
                <ul className="list-disc pl-6 my-2">
                  <li>
                    Seminar halls with ICT Enabled Facilities -{' '}
                    <a
                      href="https://srivasaviengg.ac.in/uploads/cse_extra_activities/CSE_Seminar%20Halls.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B22222] hover:underline"
                    >
                      View
                    </a>
                  </li>
                </ul>
              </details>

              <details className="border rounded-lg p-4">
                <summary className="text-lg font-semibold cursor-pointer">Laboratories</summary>
                <div className="space-y-4">
                  <p className="mt-3 text-gray-700">
                    The Department has well equipped labs with the latest Configuration. Total 9 Computer Labs for UG, PG and one research lab consisting a total of 674 systems. The various servers in the server room include Oracle 11g Database Server, Intranet Server (TOMCAT), NPTEL Video/Web Server, MAT Lab Server 2012 R2, Red Hat Linux 5.0 Server, Library Automation Server, A-Mail Server, ECAP Server, LMS Server.
                  </p>
                  <p className="text-gray-700">
                    The college has high speed internet connectivity throughout the campus through a leased line from BSNL with 1Gbps, 500Mbps from Blueifi.
                  </p>
                  <p className="text-gray-700">The following Laboratories are available in the department:</p>

                  <div className="space-y-8">
                    <div>
                      <h3 className="text-xl font-semibold my-2">James Gosling Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b" rowSpan={3}>James Gosling Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: HP Pro Tower 280 G9<br />
                                Processor: Intel® Core™ i5-13500 CPU @ 2.50 GHz<br />
                                16.00GB RAM, 500GB SSD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 21.5” LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Scroll Mouse
                              </td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 border-b">2</td>
                              <td className="py-3 px-4 border-b">
                                Model: ASUS VIVO AIO V222 GAR_V333GA<br />
                                Processor: Intel® Pentium® Silver J5040<br />
                                8.00 GB RAM, 256.00 GB SSD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 21.5” TFT Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">02</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">EF Codd Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b" rowSpan={2}>EF Codd Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: HP Pro Tower 280 G9<br />
                                Processor: Intel® Core™ i5-12400 CPU @ 2.50 GHz<br />
                                16.00 GB RAM, 500.00 GB SSD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 19.5” LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">68</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 border-b">2</td>
                              <td className="py-3 px-4 border-b">
                                Model: Dell Optiplex 3020<br />
                                Processor: Intel® Core™ i3-9100 CPU @ 3.60 GHz<br />
                                8.00 GB RAM, 1.00 TB HDD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 20.5” LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">06</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">Linus Torvalds Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b" rowSpan={2}>Linus Torvalds Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: HP Pro Tower 280 G9<br />
                                Processor: Intel core TM i3-10100 CPU @ 3.64 GHz<br />
                                8.00 GB RAM, 500.00 GB SSD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 19.5" LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">PGCP Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b" rowSpan={2}>PGCP Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: Acer Vertion Desktop System<br />
                                Processor: Intel® Core™ i3-8100 CPU @ 2.65 GHz<br />
                                8.00 GB RAM, 1.00 TB HDD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 21.5" LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">71</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 border-b">2</td>
                              <td className="py-3 px-4 border-b">
                                Model: Acer Vertion Desktop System<br />
                                Processor: Intel® Core™ i5-7400 CPU @ 3.00 GHz<br />
                                4.00 GB RAM, 1.00 TB HDD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 19.5" LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">02</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">R&D Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b" rowSpan={2}>R&amp;D Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: Acer Vertion Desktop System<br />
                                Processor: Intel® Core™ i5-7400 CPU @ 3.00 GHz<br />
                                4.00 GB RAM, 1.00 TB HDD<br />
                                System type: x64 – based Processor<br />
                                Monitor: 17.5" LED Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">03</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-4 border-b">2</td>
                              <td className="py-3 px-4 border-b">
                                Model: Dell 7D49KQR<br />
                                Processor: Intel® Core™ i5-7400 CPU @ 3.00 GHz<br />
                                4.00 GB RAM, 1.00 TB HDD<br />
                                System type: x64-based processor<br />
                                Monitor: 21.5” LED Monitor<br />
                                Keyboard: Multimedia keyboard<br />
                                Mouse: Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">07</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">Yellow Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">Yellow Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: DELL OPTI PLEX 3070<br />
                                Processor: Intel Core i3, 9th Gen<br />
                                8.00 GB RAM, 1 TB Hard Disk<br />
                                System type: x64 – based Processor<br />
                                Monitor: 20.5” TFT Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Scroll Mouse
                              </td>
                              <td className="py-3 px-4 border-b">Placements and Training</td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">Pink Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">Pink Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: DELL OPTI PLEX 3070<br />
                                Processor: Intel Core i3, 9th Gen<br />
                                8.00 GB RAM, 1 TB Hard Disk<br />
                                System type: x64 – based Processor<br />
                                Monitor: 20.5” TFT Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Scroll Mouse
                              </td>
                              <td className="py-3 px-4 border-b">Placements and Training</td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">Orange Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">Orange Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: DELL OPTI PLEX 3070<br />
                                Processor: Intel Core i3, 9th Gen<br />
                                8.00 GB RAM, 1 TB Hard Disk<br />
                                System type: x64 – based Processor<br />
                                Monitor: 20.5” TFT Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Scroll Mouse
                              </td>
                              <td className="py-3 px-4 border-b">Placements and Training</td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">Green Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">Green Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: DELL OPTI PLEX 3070<br />
                                Processor: Intel Core i3, 9th Gen<br />
                                8.00 GB RAM, 1 TB Hard Disk<br />
                                System type: x64 – based Processor<br />
                                Monitor: 20.5” TFT Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Scroll Mouse
                              </td>
                              <td className="py-3 px-4 border-b">Placements and Training</td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">Brown Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">Brown Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: DELL OPTI PLEX 3070<br />
                                Processor: Intel Core i3, 9th Gen<br />
                                8.00 GB RAM, 1 TB Hard Disk<br />
                                System type: x64 – based Processor<br />
                                Monitor: 20.5” TFT Monitor<br />
                                Keyboard: Multimedia Keyboard<br />
                                Mouse: Optical Scroll Mouse
                              </td>
                              <td className="py-3 px-4 border-b">Placements and Training</td>
                              <td className="py-3 px-4 border-b">72</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">PG CP Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Configuration</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">PG CP Lab</td>
                              <td className="py-3 px-4 border-b">
                                Model: Acer Vertion I3 Desktop System<br />
                                Processor: Intel Core i3 -8100, 8th Gen<br />
                                8 GB DDR4 RAM, 1 TB Hard Disk Drive<br />
                                Monitor: 21.5” LED Monitor<br />
                                Keyboard: USB Keyboard<br />
                                Mouse: USB Optical Mouse
                              </td>
                              <td className="py-3 px-4 border-b">AJWT, OOPS through C++ Lab</td>
                              <td className="py-3 px-4 border-b">70</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold my-2">R&amp;D Lab</h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-3 px-4 border-b text-left">S.No</th>
                              <th className="py-3 px-4 border-b text-left">Name of the Lab</th>
                              <th className="py-3 px-4 border-b text-left">Location</th>
                              <th className="py-3 px-4 border-b text-left">Usage</th>
                              <th className="py-3 px-4 border-b text-left">No. of Systems</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="py-3 px-4 border-b">1</td>
                              <td className="py-3 px-4 border-b">R&amp;D Lab</td>
                              <td className="py-3 px-4 border-b">B-Block, First Floor</td>
                              <td className="py-3 px-4 border-b">To Carryout Research Activities by Students and Faculty Members</td>
                              <td className="py-3 px-4 border-b">30</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </details>
            </div>
          </div>
        );
      case 'Faculty Development Programs':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Faculty Development Programs</h2>
            <div className="space-y-6">
              <details open className="cst-dropdown">
                <summary>FDP Attended</summary>
                <div className="cst-dropdown-content">
                  {fdp.length > 0 ? (
                    <ul className="list-disc pl-6 my-2 space-y-2">
                      {fdp.map((item, idx) => (
                        <li key={item.id ?? idx}>
                          {item.title} ({item.year})
                          {item.file_url && (
                            <>
                              {' - '}
                              <a
                                href={item.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#B22222] hover:underline"
                              >
                                View
                              </a>
                            </>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-gray-600 text-sm mt-2">No entries available currently.</div>
                  )}
                </div>
              </details>
            </div>
          </div>
        );
      case 'Faculty Achievements':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Faculty Achievements</h2>
            <div className="space-y-6">
              {data.map((section, index) => (
                <details key={index} open={index === 0} className="cst-dropdown">
                  <summary>{section.title}</summary>
                  <div className="cst-dropdown-content">
                    {section.items?.length > 0 ? (
                      <ul className="list-disc pl-6 my-2 space-y-2">
                        {section.items.map((item: any, idx: number) => (
                          <li key={idx}>
                            {item.text}
                            {item.url && (
                              <>
                                {' - '}
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#B22222] hover:underline"
                                >
                                  View
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-600 text-sm mt-2">No entries available currently.</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        );
        case 'Workshops':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Workshops/SOC/Seminars/Guest Lectures</h2>
            <div className="space-y-6">
              {workshopsdata.map((section, index) => (
                <details key={section.title} open={index === 0} className="cst-dropdown">
                  <summary>{section.title}</summary>
                  <div className="cst-dropdown-content">
                    {section.items.length > 0 ? (
                      <ul className="list-disc pl-6 my-2 space-y-2">
                        {section.items.map((item, idx) => (
                          <li key={idx}>
                            {item.text}
                            {item.url && (
                              <>
                                {' - '}
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#B22222] hover:underline"
                                >
                                  View More
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-600 text-sm mt-2">No entries available currently.</div>
                    )}
                  </div>
                </details>
              ))}
            </div>
          </div>
        );
      case 'Merit Scholarship/Academic Toppers':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Merit Scholarships and Academic Toppers</h2>

            <h3 className="text-xl font-semibold text-center mb-4">Merit Scholarships / Academic Toppers</h3>
            {/* ---------- Batch PDF Links ---------- */}
        <div className="mb-8">
          {batches.map((batch) => (
            <details
              key={batch.id}
              open
              className="border border-gray-300 rounded-lg mb-4"
            >
              <summary className="bg-gray-100 p-4 cursor-pointer text-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
                {batch.title || `Academic Toppers for the Batch ${batch.batch}`}
              </summary>
              <ul className="list-disc ml-6 mt-4">
                <li>
                  {batch.description ?? `Academic Toppers for the Batch ${batch.batch}`} –
                  <a
                    href={batch.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B22222] hover:underline ml-2"
                  >
                    View
                  </a>
                </li>
              </ul>
            </details>
          ))}

          {/* ---------- Stats Table ---------- */}
          <div className="overflow-x-auto mt-8">
            <table className="min-w-full bg-white border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">S.NO.</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">ACADEMIC YEAR</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">PARTICULARS</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">NO. OF STUDENTS BENEFITED</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 bg-gray-50">SCHOLARSHIP AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-600">{idx + 1}</td>
                    <td className="py-3 px-4 text-gray-600">{row.academic_year}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{row.particulars}</td>
                    <td className="py-3 px-4 text-gray-600">{row.students_benefited}</td>
                    <td className="py-3 px-4 text-gray-600">{row.scholarship_amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
            {/* ---------- Image Gallery ---------- */}

            <h2 className="text-2xl font-bold text-center mb-4 mt-8">Gallery</h2>
        {acdemictoppersgal.galleries.map(g => (
          <div key={g.id} className="container mx-auto mb-8">
            <div className="text-center text-xl font-semibold mb-2">{g.title}</div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {g.images.map(img => (
                <div key={img.id} className="w-full md:w-1/3 flex justify-center">
                  <img src={img.image_url} alt={img.alt_text || 'Hackathon image'}
                       className="img-fluid m-3 rounded shadow" />
                </div>
              ))}
            </div>
          </div>
        ))}
          </div>
        );
      case 'Extra-Curricular Activities':
        return (
          <div id="extra-curricular-activities" className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">
          Extra-Curricular Activities
        </h2>

        {/* Documents */}
        <ul className="list-disc ml-6 mt-4">
          {extra.documents.map(doc => (
            <li key={doc.id}>
              {doc.title} ({doc.academic_year}) –
              <a
                href={doc.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B22222] hover:underline ml-2"
              >
                View More
              </a>
            </li>
          ))}
        </ul>

        {/* Clubs */}
        {extra.clubs.map(club => (
          <div key={club.id} className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-6 pb-2 border-b-2 border-primary">
              {club.name}
            </h3>
            <div className="prose max-w-none">
              <h3 className="text-lg font-bold mb-2">{club.subtitle}</h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                {club.description}
              </p>
            </div>
          </div>
        ))}
      </div>
          </div>
        );

      case 'Technical Association':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Technical Association</h2>
             {technicalAssociation.map((section, idx) => (
          <div key={idx} className="mt-4">
            <details>
              <summary className="text-lg font-semibold">{section.title}</summary>
              <div className="nav-content">
                <ul className="list-disc ml-6 mt-4">
                  {section.items?.map((item: any, i: number) => (
                    <li key={i}>
                      {item.text}
                      {item.url && (
                        <>
                          {" – "}
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#B22222] hover:underline ml-2"
                          >
                            View
                          </a>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          </div>
        ))}
          </div>
        );
      
      case 'Handbooks':
        return (
          <div id="handbooks" className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">
          Academic HandBooks
        </h2>

        <div className="space-y-6">
          {handbooks.map((group) => (
            <div key={group.group} className="space-y-4">
              {/* group.group is like "Academic Year 2023-24" */}
              {Array.from(
                new Set(group.items.map((i: any) => i.sem_type))
              ).map((sem) => (
                <details key={String(sem)} open>
                  <summary className="text-lg font-semibold text-[#B22222] cursor-pointer">
                    {group.group}: {sem}
                  </summary>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    {group.items
                      .filter((i: any) => i.sem_type === sem)
                      .map((i: any, idx: number) => (
                        <li key={idx}>
                          {i.text} –
                          <a
                            href={i.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#B22222] hover:underline ml-2"
                          >
                            View
                          </a>
                        </li>
                      ))}
                  </ul>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
          </div>
        );
      case 'Hackathons':
        return (
          <div id="hackathons" className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Hackathons</h2>

        {/* Documents */}
        <div className="mb-6">
          <ul className="list-disc list-inside">
            {hackathons.documents.map(doc => (
              <li key={doc.id}>
                {doc.title} -
                <a href={doc.file_url} target="_blank" rel="noopener noreferrer"
                   className="text-[#B22222] hover:underline ml-2">
                  For more details
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Galleries */}
        <h2 className="text-2xl font-bold text-center mb-4 mt-8">Gallery</h2>
        {hackathons.galleries.map(g => (
          <div key={g.id} className="container mx-auto mb-8">
            <div className="text-center text-xl font-semibold mb-2">{g.title}</div>
            <div className="flex flex-wrap justify-center items-center gap-4">
              {g.images.map(img => (
                <div key={img.id} className="w-full md:w-1/3 flex justify-center">
                  <img src={img.image_url} alt={img.alt_text || 'Hackathon image'}
                       className="img-fluid m-3 rounded shadow" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
          </div>
        );

      case 'Training Activities':
        return (
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Training Activities</h2>

            <div className="space-y-6">
              <details open className="border rounded-lg p-4">
                <summary className="text-lg font-semibold cursor-pointer">Training Activities during the Academic Year 2022-2023</summary>
                <ul className="list-disc pl-6 my-2">
                  <li>
                    Training Activities during the Academic Year 2022-2023 -{' '}
                    <a
                      href="https://srivasaviengg.ac.in/uploads/cst/tt_2022-23.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B22222] hover:underline"
                    >
                      View More
                    </a>
                  </li>
                </ul>
              </details>

              <details className="border rounded-lg p-4">
                <summary className="text-lg font-semibold cursor-pointer">Training Activities during the Academic Year 2021-2022</summary>
                <ul className="list-disc pl-6 my-2">
                  <li>
                    Training Activities during the Academic Year 2021-2022 -{' '}
                    <a
                      href="https://srivasaviengg.ac.in/uploads/cst/tt_2021-22.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#B22222] hover:underline"
                    >
                      View More
                    </a>
                  </li>
                </ul>
              </details>

              <details className="border rounded-lg p-4">
                <summary className="text-lg font-semibold cursor-pointer">Gallery</summary>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <img src="https://srivasaviengg.ac.in/images/departments/cst/g.jpg" alt="Training Activity Image 1" className="w-full h-auto rounded-lg shadow object-cover" />
                  <img src="https://srivasaviengg.ac.in/images/departments/cst/g1.jpg" alt="Training Activity Image 2" className="w-full h-auto rounded-lg shadow object-cover" />
                  <img src="https://srivasaviengg.ac.in/images/departments/cst/g2.jpg" alt="Training Activity Image 3" className="w-full h-auto rounded-lg shadow object-cover" />
                  <img src="https://srivasaviengg.ac.in/images/departments/cst/g3.jpg" alt="Training Activity Image 4" className="w-full h-auto rounded-lg shadow object-cover" />
                </div>
              </details>
            </div>
          </div>
        );
      case 'Placements':
        return (
          <div id="placements" className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <h2 className="text-3xl font-bold text-[#B22222] mb-6 text-center">Placements</h2>
              {placements.map((section, idx) => (
                <div key={idx} className="mt-4">
                  <details>
                    <summary className="text-lg font-semibold">{section.title}</summary>
                    <div className="nav-content">
                      <ul className="list-disc ml-6 mt-4">
                        {section.items?.map((item: any, i: number) => (
                          <li key={i}>
                            {item.text}
                            {item.url && (
                              <>
                                {" – "}
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#B22222] hover:underline ml-2"
                                >
                                  View
                                </a>
                              </>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg text-center"><h3 className="text-xl font-semibold text-gray-600">Content for {activeContent} coming soon...</h3></div>;
    }
  };

   const renderContentWithTitle = () => {
    // Just return the content without adding another title, since it's already included in content sections
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 min-h-[500px]">
        {renderContent()}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DepartmentSidebar
        items={sidebarItems}
        activeItem={activeContent}
        onItemClick={setActiveContent}
        title="CSE-DS Department"
      >
        {renderContentWithTitle()}
      </DepartmentSidebar>
      {/* Footer is only shown when scrolling the main content area, not the sidebar */}
    </div>
  );
};

export default CSTDepartment;

