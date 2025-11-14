'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { fetchWithErrorHandling, safeJsonParse } from '@/utils/api-helpers';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Grid3X3, 
  List, 
  BookOpen,
  Users,
  Award,
  Settings,
  GraduationCap,
  Building2,
  Globe,
  FileText,
  Activity,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  Filter,
  Download,
  Upload,
  LogOut,
  User,
  Home
} from 'lucide-react';
import { BackButton } from '@/components/ui/BackButton';

// Department-specific modules configuration
const DEPARTMENT_MODULES: Record<string, Array<{
  key: string;
  name: string;
  icon: any;
  description: string;
  table: string;
}>> = {
  'cse-ai': [
    { key: 'bos-members', name: 'BOS Members', icon: Users, description: 'Board of Studies members', table: 'cai_bos_members' },
    { key: 'bos-minutes', name: 'BOS Minutes', icon: FileText, description: 'Board of Studies meeting minutes', table: 'cai_bos_minutes' },
    { key: 'department-library', name: 'Department Library', icon: BookOpen, description: 'Library resources and books', table: 'cai_department_library' },
    { key: 'department-overview', name: 'Department Overview', icon: Building2, description: 'Department overview and information', table: 'cai_department_overview' },
    { key: 'eresources', name: 'E-Resources', icon: Globe, description: 'Digital learning resources', table: 'cai_eresources' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'cai_extra_curricular' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'cai_faculty' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'cai_faculty_achievements' },
    { key: 'faculty-development', name: 'Faculty Development', icon: GraduationCap, description: 'Faculty development programs', table: 'cai_faculty_development' },
    { key: 'hackathons', name: 'Hackathons', icon: Briefcase, description: 'Coding competitions and events', table: 'cai_hackathons' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'cai_handbooks' },
    { key: 'industry-programs', name: 'Industry Programs', icon: Briefcase, description: 'Industry collaboration programs', table: 'cai_industry_programs' },
    { key: 'merit-scholarships', name: 'Merit Scholarships', icon: Award, description: 'Student scholarship programs', table: 'cai_merit_scholarships' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'cai_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'cai_newsletters' },
    { key: 'non-teaching-faculty', name: 'Non-Teaching Faculty', icon: Users, description: 'Non-teaching staff members', table: 'cai_non_teaching_faculty' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'cai_physical_facilities' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'cai_placements' },
    { key: 'sahaya-events', name: 'Sahaya Events', icon: Activity, description: 'Sahaya community events', table: 'cai_sahaya_events' },
    { key: 'scud-activities', name: 'SCUD Activities', icon: Activity, description: 'SCUD club activities', table: 'cai_scud_activities' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'cai_student_achievements' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'cai_syllabus' },
    { key: 'technical-faculty', name: 'Technical Faculty', icon: Users, description: 'Technical staff members', table: 'cai_technical_faculty' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'cai_training_activities' }
  ],
  'ece': [
    { key: 'board-of-studies', name: 'Board of Studies', icon: BookOpen, description: 'Academic board meetings and decisions', table: 'ece_board_of_studies' },
    { key: 'clubs', name: 'Clubs', icon: Users, description: 'Student clubs and organizations', table: 'ece_clubs' },
    { key: 'extracurricular-activities', name: 'Extra-Curricular Activities', icon: Activity, description: 'Student activities and events', table: 'ece_extracurricular_activities' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'ece_faculty_achievements' },
    { key: 'faculty-data', name: 'Faculty Data', icon: Users, description: 'Faculty profiles and information', table: 'ece_faculty' },
    { key: 'faculty-innovations', name: 'Faculty Innovations', icon: Settings, description: 'Faculty research and innovations', table: 'ece_faculty_innovations' },
    { key: 'fdp', name: 'Faculty Development Programs', icon: GraduationCap, description: 'Professional development programs', table: 'ece_fdp' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'ece_handbooks' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'ece_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'ece_newsletters' },
    { key: 'ntfaculty', name: 'Non-Teaching Faculty', icon: Users, description: 'Non-teaching staff members', table: 'ece_nonteaching_faculty' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'ece_physical_facilities' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'ece_placements' },
    { key: 'scholarships-toppers', name: 'Scholarships & Toppers', icon: Award, description: 'Student achievements and scholarships', table: 'ece_scholarships_toppers' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'ece_syllabus' },
    { key: 'teaching-faculty', name: 'Teaching Faculty', icon: Users, description: 'Teaching faculty members', table: 'ece_teaching_faculty' },
    { key: 'technical-association', name: 'Technical Association', icon: Settings, description: 'Professional associations', table: 'ece_technicalAssociation_trainingActivities' },
    { key: 'workshops', name: 'Workshops', icon: Settings, description: 'Educational workshops', table: 'ece_worshops_gl' }
  ],
  'civil': [
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'civil_faculty' },
    { key: 'board-of-studies', name: 'Board of Studies', icon: BookOpen, description: 'Civil board meeting minutes', table: 'bos_civil_meeting_minutes' },
    { key: 'consultancy', name: 'Consultancy', icon: Briefcase, description: 'Consultancy services', table: 'civil_consultancy' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'civil_extra_curricular_activities' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'civil_newsletters' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'civil_physical_facilities' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'civil_student_achievements' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'civil_syllabus' },
    { key: 'technical-association', name: 'Technical Association', icon: Settings, description: 'Professional associations', table: 'civil_technical_association' },
    { key: 'workshops', name: 'Workshops', icon: Settings, description: 'Educational workshops', table: 'civil_workshops' }
  ],
  'mech': [
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'mech_faculty' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'mech_facultyachievements' },
    { key: 'faculty-methods', name: 'Faculty Methods', icon: Settings, description: 'Teaching and learning methods', table: 'mech_facultyTLmethods' },
    { key: 'laboratories', name: 'Laboratories', icon: Building2, description: 'Laboratory facilities', table: 'mech_laboratories' },
    { key: 'library', name: 'Library', icon: BookOpen, description: 'Library resources', table: 'mech_library' },
    { key: 'magazines', name: 'Magazines', icon: FileText, description: 'Department magazines', table: 'mech_magazines' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'mech_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'mech_newsletters' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'mech_placements' },
    { key: 'project-research', name: 'Project Research', icon: Settings, description: 'Research projects', table: 'mech_project_research' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'mech_studentachievements' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'mech_syllabus' },
    { key: 'technical-association', name: 'Technical Association', icon: Settings, description: 'Professional associations', table: 'mech_technicalassociation' },
    { key: 'workshops', name: 'Workshops', icon: Settings, description: 'Educational workshops', table: 'mech_workshops' }
  ],
  'cse': [
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'cse_faculty' },
    { key: 'staff', name: 'Staff', icon: Users, description: 'Non-teaching and technical staff', table: 'cse_staff' },
    { key: 'achievements', name: 'Achievements', icon: Award, description: 'Department achievements and recognitions', table: 'cse_achievements' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'cse_placements' },
    { key: 'hackathons', name: 'Hackathons', icon: Briefcase, description: 'Coding competitions and events', table: 'cse_hackathons' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'cse_handbooks' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'cse_mous' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'cse_syllabus' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'cse_physical_facilities' },
    { key: 'department-library', name: 'Department Library', icon: BookOpen, description: 'Library resources and books', table: 'cse_department_library' },
    { key: 'merit-scholarships', name: 'Merit Scholarships', icon: Award, description: 'Student scholarship programs', table: 'cse_merit_scholarships' },
    { key: 'technical-association', name: 'Technical Association', icon: Settings, description: 'Professional associations', table: 'cse_technical_association' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'cse_training_activities' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'cse_newsletters' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'cse_extra_curricular' }
  ],
  'cst': [
    { key: 'bos-members', name: 'BOS Members', icon: Users, description: 'Board of Studies members', table: 'cst_bos_members' },
    { key: 'bos-minutes', name: 'BOS Minutes', icon: FileText, description: 'Board of Studies meeting minutes', table: 'cst_bos_minutes' },
    { key: 'department-library', name: 'Department Library', icon: BookOpen, description: 'Library resources and books', table: 'cst_department_library' },
    { key: 'department-overview', name: 'Department Overview', icon: Building2, description: 'Department overview and information', table: 'cst_department_overview' },
    { key: 'eresources', name: 'E-Resources', icon: Globe, description: 'Digital learning resources', table: 'cst_eresources' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'cst_extra_curricular' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'cst_faculty' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'cst_faculty_achievements' },
    { key: 'faculty-development', name: 'Faculty Development', icon: GraduationCap, description: 'Faculty development programs', table: 'cst_faculty_development' },
    { key: 'hackathons', name: 'Hackathons', icon: Briefcase, description: 'Coding competitions and events', table: 'cst_hackathons' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'cst_handbooks' },
    { key: 'industry-programs', name: 'Industry Programs', icon: Briefcase, description: 'Industry collaboration programs', table: 'cst_industry_programs' },
    { key: 'merit-scholarships', name: 'Merit Scholarships', icon: Award, description: 'Student scholarship programs', table: 'cst_merit_scholarships' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'cst_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'cst_newsletters' },
    { key: 'non-teaching-faculty', name: 'Non-Teaching Faculty', icon: Users, description: 'Non-teaching staff members', table: 'cst_non_teaching_faculty' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'cst_physical_facilities' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'cst_placements' },
    { key: 'sahaya-events', name: 'Sahaya Events', icon: Activity, description: 'Sahaya community events', table: 'cst_sahaya_events' },
    { key: 'scud-activities', name: 'SCUD Activities', icon: Activity, description: 'SCUD club activities', table: 'cst_scud_activities' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'cst_student_achievements' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'cst_syllabus' },
    { key: 'technical-faculty', name: 'Technical Faculty', icon: Users, description: 'Technical staff members', table: 'cst_technical_faculty' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'cst_training_activities' }
  ],
  'eee': [
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'eee_faculty' },
    { key: 'bos-members', name: 'BOA Members', icon: Users, description: 'Board of Studies members', table: 'eee_bos_members' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'eee_syllabus' },
    { key: 'faculty-innovations', name: 'Faculty Innovations', icon: Settings, description: 'Faculty teaching and research innovations', table: 'faculty_innovations' },
    { key: 'research-centers', name: 'Research Centers', icon: Building2, description: 'Department research centers and facilities', table: 'research_centers' },
    { key: 'product-development', name: 'Product Development', icon: Briefcase, description: 'Product development projects and innovations', table: 'product_development' },
    { key: 'departmental-activities', name: 'Departmental Activities', icon: Activity, description: 'Department events and activities', table: 'departmental_activities' },
    { key: 'green-initiatives', name: 'Green Initiatives', icon: Globe, description: 'Environmental and sustainability initiatives', table: 'green_initiatives' },
    { key: 'technical-magazines', name: 'Technical Magazines', icon: FileText, description: 'Department publications and magazines', table: 'technical_magazines' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'student_achievements' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'faculty_achievements' },
    { key: 'workshops', name: 'Workshops', icon: Settings, description: 'Educational workshops and training', table: 'workshops' },
    { key: 'fdp', name: 'Faculty Development Programs', icon: GraduationCap, description: 'Professional development programs', table: 'fdp' },
    { key: 'organized-events', name: 'Organized Events', icon: Activity, description: 'Events organized by department', table: 'organized_events' },
    { key: 'labs', name: 'Laboratories', icon: Building2, description: 'Laboratory facilities and equipment', table: 'labs' }
  ],
  'mba': [
    { key: 'board-of-studies', name: 'Board of Studies', icon: BookOpen, description: 'Academic board meetings and decisions', table: 'cai_board_of_studies' },
    { key: 'contact', name: 'Contact Information', icon: Globe, description: 'Department contact details', table: 'cai_contact' },
    { key: 'department-info', name: 'Department Info', icon: Building2, description: 'Basic department information', table: 'cai_department_info' },
    { key: 'department-library', name: 'Department Library', icon: BookOpen, description: 'Library resources and books', table: 'cai_department_library' },
    { key: 'eresources', name: 'E-Resources', icon: Globe, description: 'Digital learning resources', table: 'cai_eresources' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'cai_extra_curricular' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'cai_faculty_achievements' },
    { key: 'faculty-development-programs', name: 'Faculty Development', icon: GraduationCap, description: 'Professional development programs', table: 'cai_faculty_development_programs' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'mba_faculty' },
    { key: 'hackathons', name: 'Hackathons', icon: Briefcase, description: 'Coding competitions and events', table: 'cai_hackathons' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'cai_handbooks' },
    { key: 'merit-scholarships', name: 'Merit Scholarships', icon: Award, description: 'Student scholarship programs', table: 'cai_merit_scholarships' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'cai_newsletters' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'cai_physical_facilities' },
    { key: 'placement-batches', name: 'Placement Batches', icon: Users, description: 'Student placement records', table: 'cai_placement_batches' },
    { key: 'placement-gallery', name: 'Placement Gallery', icon: Users, description: 'Placement success stories', table: 'cai_placement_gallery' },
    { key: 'staff', name: 'Staff', icon: Users, description: 'Non-teaching staff members', table: 'cai_staff' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'cai_student_achievements' },
    { key: 'technical-association', name: 'Technical Association', icon: Settings, description: 'Professional associations', table: 'cai_technical_association' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'cai_training_activities' },
    { key: 'workshops', name: 'Workshops', icon: Settings, description: 'Educational workshops', table: 'cai_workshops' }
  ],
  'bsh': [
    { key: 'activities', name: 'Activities', icon: Activity, description: 'Department activities', table: 'bsh_activities' },
    { key: 'board-of-studies', name: 'Board of Studies', icon: BookOpen, description: 'Academic board meetings and decisions', table: 'bsh_board_of_studies' },
    { key: 'department-documents', name: 'Department Documents', icon: FileText, description: 'Important department documents', table: 'bsh_department_documents' },
    { key: 'department-profile', name: 'Department Profile', icon: Building2, description: 'Department profile and information', table: 'bsh_department_profile' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'bsh_faculty' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'bsh_faculty_achievements' },
    { key: 'faculty-paper-presentations', name: 'Faculty Paper Presentations', icon: FileText, description: 'Faculty research presentations', table: 'bsh_faculty_paper_presentations' },
    { key: 'laboratories', name: 'Laboratories', icon: Building2, description: 'Laboratory facilities', table: 'bsh_laboratories' },
    { key: 'results', name: 'Results', icon: Award, description: 'Academic results', table: 'bsh_results' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'bsh_student_achievements' },
    { key: 'non-teaching-faculty', name: 'Non-Teaching Faculty', icon: Users, description: 'Non-teaching staff members', table: 'non_teaching_bsh_faculty' }
  ],
  'ect': [
    { key: 'clubs', name: 'Clubs', icon: Users, description: 'Student clubs and organizations', table: 'ect_clubs' },
    { key: 'extracurricular-activities', name: 'Extra-Curricular Activities', icon: Activity, description: 'Student activities and events', table: 'ect_extracurricular_activities' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'ect_faculty' },
    { key: 'faculty-innovations', name: 'Faculty Innovations', icon: Settings, description: 'Faculty research and innovations', table: 'ect_facultyinnovations' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'ect_faculty_achievements' },
    { key: 'fdp', name: 'Faculty Development Programs', icon: GraduationCap, description: 'Professional development programs', table: 'ect_fdp' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'ect_handbooks' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'ect_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'ect_newsletters' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'ect_physical_facilities' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'ect_placements' },
    { key: 'scholarships-toppers', name: 'Scholarships & Toppers', icon: Award, description: 'Student achievements and scholarships', table: 'ect_scholarships_toppers' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'ect_syllabus' },
    { key: 'technical-association', name: 'Technical Association', icon: Settings, description: 'Professional associations', table: 'ect_technical_association' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'ect_training_activities' },
    { key: 'workshop', name: 'Workshop', icon: Settings, description: 'Educational workshops', table: 'ect_workshop_gl' }
  ],
  'aiml': [
    { key: 'bos-members', name: 'BOS Members', icon: Users, description: 'Board of Studies members', table: 'aiml_bos_members' },
    { key: 'bos-minutes', name: 'BOS Minutes', icon: FileText, description: 'Board of Studies meeting minutes', table: 'aiml_bos_minutes' },
    { key: 'department-library', name: 'Department Library', icon: BookOpen, description: 'Library resources and books', table: 'aiml_department_library' },
    { key: 'department-overview', name: 'Department Overview', icon: Building2, description: 'Department overview and information', table: 'aiml_department_overview' },
    { key: 'eresources', name: 'E-Resources', icon: Globe, description: 'Digital learning resources', table: 'aiml_eresources' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'aiml_extra_curricular' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'aiml_faculty' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'aiml_faculty_achievements' },
    { key: 'faculty-development', name: 'Faculty Development', icon: GraduationCap, description: 'Faculty development programs', table: 'aiml_faculty_development' },
    { key: 'hackathons', name: 'Hackathons', icon: Briefcase, description: 'Coding competitions and events', table: 'aiml_hackathons' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'aiml_handbooks' },
    { key: 'industry-programs', name: 'Industry Programs', icon: Briefcase, description: 'Industry collaboration programs', table: 'aiml_industry_programs' },
    { key: 'merit-scholarships', name: 'Merit Scholarships', icon: Award, description: 'Student scholarship programs', table: 'aiml_merit_scholarships' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'aiml_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'aiml_newsletters' },
    { key: 'non-teaching-faculty', name: 'Non-Teaching Faculty', icon: Users, description: 'Non-teaching staff members', table: 'aiml_non_teaching_faculty' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'aiml_physical_facilities' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'aiml_placements' },
    { key: 'sahaya-events', name: 'Sahaya Events', icon: Activity, description: 'Sahaya community events', table: 'aiml_sahaya_events' },
    { key: 'scud-activities', name: 'SCUD Activities', icon: Activity, description: 'SCUD club activities', table: 'aiml_scud_activities' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'aiml_student_achievements' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'aiml_syllabus' },
    { key: 'technical-faculty', name: 'Technical Faculty', icon: Users, description: 'Technical staff members', table: 'aiml_technical_faculty' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'aiml_training_activities' }
  ],
  'cse-ds': [
    { key: 'bos-members', name: 'BOS Members', icon: Users, description: 'Board of Studies members', table: 'ds_bos_members' },
    { key: 'bos-minutes', name: 'BOS Minutes', icon: FileText, description: 'Board of Studies meeting minutes', table: 'ds_bos_minutes' },
    { key: 'department-library', name: 'Department Library', icon: BookOpen, description: 'Library resources and books', table: 'ds_department_library' },
    { key: 'department-overview', name: 'Department Overview', icon: Building2, description: 'Department overview and information', table: 'ds_department_overview' },
    { key: 'eresources', name: 'E-Resources', icon: Globe, description: 'Digital learning resources', table: 'ds_eresources' },
    { key: 'extra-curricular', name: 'Extra-Curricular', icon: Activity, description: 'Student activities and events', table: 'ds_extra_curricular' },
    { key: 'faculty', name: 'Faculty', icon: Users, description: 'Faculty members and profiles', table: 'ds_faculty' },
    { key: 'faculty-achievements', name: 'Faculty Achievements', icon: Award, description: 'Faculty awards and recognitions', table: 'ds_faculty_achievements' },
    { key: 'faculty-development', name: 'Faculty Development', icon: GraduationCap, description: 'Faculty development programs', table: 'ds_faculty_development' },
    { key: 'hackathons', name: 'Hackathons', icon: Briefcase, description: 'Coding competitions and events', table: 'ds_hackathons' },
    { key: 'handbooks', name: 'Handbooks', icon: BookOpen, description: 'Academic handbooks and guides', table: 'ds_handbooks' },
    { key: 'industry-programs', name: 'Industry Programs', icon: Briefcase, description: 'Industry collaboration programs', table: 'ds_industry_programs' },
    { key: 'merit-scholarships', name: 'Merit Scholarships', icon: Award, description: 'Student scholarship programs', table: 'ds_merit_scholarships' },
    { key: 'mous', name: 'MOUs', icon: FileText, description: 'Memorandums of Understanding', table: 'ds_mous' },
    { key: 'newsletters', name: 'Newsletters', icon: FileText, description: 'Department publications', table: 'ds_newsletters' },
    { key: 'non-teaching-faculty', name: 'Non-Teaching Faculty', icon: Users, description: 'Non-teaching staff members', table: 'ds_non_teaching_faculty' },
    { key: 'physical-facilities', name: 'Physical Facilities', icon: Building2, description: 'Infrastructure and equipment', table: 'ds_physical_facilities' },
    { key: 'placements', name: 'Placements', icon: Users, description: 'Student placement records', table: 'ds_placements' },
    { key: 'sahaya-events', name: 'Sahaya Events', icon: Activity, description: 'Sahaya community events', table: 'ds_sahaya_events' },
    { key: 'scud-activities', name: 'SCUD Activities', icon: Activity, description: 'SCUD club activities', table: 'ds_scud_activities' },
    { key: 'student-achievements', name: 'Student Achievements', icon: Award, description: 'Student awards and recognitions', table: 'ds_student_achievements' },
    { key: 'syllabus', name: 'Syllabus', icon: BookOpen, description: 'Course curriculum and syllabus', table: 'ds_syllabus' },
    { key: 'technical-faculty', name: 'Technical Faculty', icon: Users, description: 'Technical staff members', table: 'ds_technical_faculty' },
    { key: 'training-activities', name: 'Training Activities', icon: GraduationCap, description: 'Training programs and workshops', table: 'ds_training_activities' }
  ]
};

const DEPARTMENT_NAMES: Record<string, string> = {
  'cse-ai': 'Computer Science & AI',
  'ece': 'Electronics & Communication Engineering',
  'civil': 'Civil Engineering',
  'mech': 'Mechanical Engineering',
  'cse': 'Computer Science Engineering',
  'cst': 'Computer Science & Technology',
  'eee': 'Electrical & Electronics Engineering',
  'mba': 'Business Administration',
  'bsh': 'Basic Sciences & Humanities',
  'ect': 'Electronics & Communication Technology',
  'aiml': 'AI & Machine Learning',
  'cse-ds': 'Computer Science & Data Science'
};

interface ModuleData {
  id: number;
  [key: string]: any;
}

interface DepartmentDashboardProps {
  params: Promise<{ dept: string }>;
}

export default function DepartmentDashboard({ params }: DepartmentDashboardProps) {
  const [dept, setDept] = useState<string>('');
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [moduleData, setModuleData] = useState<ModuleData[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ModuleData | null>(null);
  const [tableColumns, setTableColumns] = useState<any[]>([]);
  // Cache for frequently accessed data
  const [dataCache, setDataCache] = useState<Record<string, {data: ModuleData[], timestamp: number}>>({});
  const [structureCache, setStructureCache] = useState<Record<string, {columns: any[], timestamp: number}>>({});
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // Resolve the params promise
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setDept(resolvedParams.dept);
    };
    resolveParams();
  }, [params]);

  // Check authentication and department access
  useEffect(() => {
    // Don't run checks while auth is still loading
    if (authLoading) {
      console.log('Auth still loading, skipping checks');
      return;
    }

    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/auth/login');
      return;
    }

    console.log('User authenticated:', user.username, 'Role:', user.role, 'Dept:', user.department);

    // Check if user has access to this department
    if (user.role !== 'super_admin' && user.role !== 'admin' && user.department !== dept && dept) {
      console.log('Access denied to department:', dept);
      toast.error('You do not have access to this department');
      router.push('/auth/login');
      return;
    }

    console.log('Department access granted for:', dept);
  }, [user, dept, router, authLoading]);

  // Show loading while authentication is being checked
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show loading while params are being resolved
  if (!user || !dept) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Get current department modules
  const currentModules = DEPARTMENT_MODULES[dept] || [];
  const departmentName = DEPARTMENT_NAMES[dept] || dept.toUpperCase();

  // Filter modules based on search
  const filteredModules = currentModules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Optimized module data loading with caching
  const loadModuleData = async (moduleKey: string, page: number = 1) => {
    const cacheKey = `${dept}-${moduleKey}-${page}`;
    const cached = dataCache[cacheKey];
    
    // Check cache first
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      setModuleData(cached.data);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    const authToken = localStorage.getItem('authToken');
    const headers = { 'Authorization': `Bearer ${authToken}` };
    
    try {
      // Use Promise.allSettled for parallel requests
      const [structureResult, dataResult] = await Promise.allSettled([
        // Structure request with caching
        (async () => {
          const structureCacheKey = `${dept}-${moduleKey}-structure`;
          const cachedStructure = structureCache[structureCacheKey];
          
          if (cachedStructure && Date.now() - cachedStructure.timestamp < CACHE_DURATION) {
            return { fields: cachedStructure.columns };
          }
          
          const result = await fetchWithErrorHandling(`/api/admin/departments/${dept}/${moduleKey}/structure`, { headers });
          
          // Cache structure
          setStructureCache(prev => ({
            ...prev,
            [structureCacheKey]: { columns: result.fields || [], timestamp: Date.now() }
          }));
          
          return result;
        })(),
        
        // Data request
        fetchWithErrorHandling(`/api/admin/departments/${dept}/${moduleKey}?page=${page}&limit=1000`, { headers })
      ]);
      
      // Handle structure result
      if (structureResult.status === 'fulfilled') {
        setTableColumns(structureResult.value.fields || []);
      } else {
        console.warn('Failed to load table structure:', structureResult.reason);
        setTableColumns([]);
      }
      
      // Handle data result
      if (dataResult.status === 'fulfilled' && dataResult.value.success && dataResult.value.data) {
        const data = dataResult.value.data.records || [];
        setModuleData(data);
        setTotalRecords(dataResult.value.data.total || 0);
        setTotalPages(dataResult.value.data.totalPages || 1);
        setCurrentPage(page);
        
        // Cache the data
        setDataCache(prev => ({
          ...prev,
          [cacheKey]: { data, timestamp: Date.now() }
        }));
      } else {
        setModuleData([]);
        setTotalRecords(0);
        setTotalPages(1);
        if (dataResult.status === 'rejected') {
          console.error('Data fetch failed:', dataResult.reason);
        } else {
          toast.error('No data found for this module');
        }
      }
    } catch (error) {
      console.error('Error loading module data:', error);
      setModuleData([]);
      setTotalRecords(0);
      setTotalPages(1);
      if (error instanceof Error) {
        toast.error(`Failed to load data: ${error.message}`);
      } else {
        toast.error('Failed to load module data');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle module selection
  const handleModuleSelect = (moduleKey: string) => {
    setSelectedModule(moduleKey);
    setCurrentPage(1);
    loadModuleData(moduleKey, 1);
  };

  // CRUD Operations
  const handleCreate = () => {
    setEditingItem(null);
    setShowCreateModal(true);
  };

  const handleEdit = (item: ModuleData) => {
    setEditingItem(item);
    setShowCreateModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this item? This will also delete any associated files.')) return;
    
    // Find the item to be deleted to get file URL
    const itemToDelete = moduleData.find(item => item.id === id);
    
    // Optimistic UI update - remove item immediately
    const originalData = [...moduleData];
    const updatedData = moduleData.filter(item => item.id !== id);
    setModuleData(updatedData);
    setTotalRecords(prev => prev - 1);
    
    try {
      const authToken = localStorage.getItem('authToken');
      
      // First, delete associated files if they exist
      if (itemToDelete) {
        const fileFields = ['file_url', 'document_url', 'profile_url', 'image_url', 'pdf_url', 'link_url'];
        
        for (const field of fileFields) {
          if (itemToDelete[field]) {
            try {
              await fetchWithErrorHandling(`/api/admin/departments/${dept}/${selectedModule}/delete-file`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${authToken}`
                },
                body: JSON.stringify({ fileUrl: itemToDelete[field] })
              });
            } catch (fileError) {
              console.warn('Could not delete file:', itemToDelete[field], fileError);
            }
          }
        }
      }
      
      const deletePromise = fetchWithErrorHandling(`/api/admin/departments/${dept}/${selectedModule}?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      // Don't wait for the server response for UI feedback
      toast.success('Record and associated files deleted successfully');
      
      const result = await deletePromise;
      
      if (result.success) {
        // Clear relevant cache entries
        const cacheKey = `${dept}-${selectedModule}-${currentPage}`;
        setDataCache(prev => {
          const newCache = { ...prev };
          delete newCache[cacheKey];
          // Also clear adjacent pages
          delete newCache[`${dept}-${selectedModule}-${currentPage - 1}`];
          delete newCache[`${dept}-${selectedModule}-${currentPage + 1}`];
          return newCache;
        });
      } else {
        // Revert optimistic update on failure
        setModuleData(originalData);
        setTotalRecords(prev => prev + 1);
        toast.error(result.error || 'Failed to delete item');
      }
    } catch (error) {
      // Revert optimistic update on error
      setModuleData(originalData);
      setTotalRecords(prev => prev + 1);
      toast.dismiss(); // Remove success toast
      console.error('Error deleting item:', error);
      if (error instanceof Error) {
        toast.error(`Delete failed: ${error.message}`);
      } else {
        toast.error('Error deleting item');
      }
    }
  };

  const handleSave = async (data: any) => {
    try {
      const authToken = localStorage.getItem('authToken');
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem 
        ? `/api/admin/departments/${dept}/${selectedModule}?id=${editingItem.id}`
        : `/api/admin/departments/${dept}/${selectedModule}`;

      // Check if the table has a 'dept' column before including it
      const hasDeptColumn = tableColumns.some(field => field.Field === 'dept');
      
      // Conditionally include dept field only if the table has that column
      const saveData = hasDeptColumn 
        ? { ...data, dept: dept } // Add dept if table has the column
        : { ...data }; // Don't add dept if table doesn't have the column

      const result = await fetchWithErrorHandling(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(saveData)
      });

      if (result.success) {
        setShowCreateModal(false);
        setEditingItem(null);
        toast.success(editingItem ? 'Record updated successfully' : 'Record created successfully');
        if (selectedModule) {
          loadModuleData(selectedModule, currentPage);
        }
      } else {
        toast.error(`Failed to save: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      if (error instanceof Error) {
        toast.error(`Save failed: ${error.message}`);
      } else {
        toast.error('Error saving item');
      }
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  // If module is selected, show module detail view
  if (selectedModule) {
    const module = currentModules.find(m => m.key === selectedModule);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 pt-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Button 
                  variant="ghost" 
                  onClick={() => setSelectedModule(null)}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-medium border border-blue-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => window.history.back()}
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  ← Previous Page
                </Button>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="text-gray-600 hover:text-blue-600 px-2 py-1 h-auto"
                >
                  Home
                </Button>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full shadow-sm">
                  {departmentName}
                </Badge>
                <ChevronRight className="w-4 h-4 text-gray-300" />
                <span className="font-medium text-gray-700">{module?.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleLogout} 
                  variant="outline" 
                  size="sm"
                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    {module?.icon && <module.icon className="w-8 h-8 text-blue-600" />}
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{module?.name}</h1>
                  </div>
                  <p className="text-gray-600 text-lg">{module?.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <Badge variant="secondary" className="px-4 py-2 bg-gray-100 text-gray-700 font-medium">
                      {totalRecords} {totalRecords === 1 ? 'record' : 'records'}
                    </Badge>
                  </div>
                  <Button 
                    onClick={handleCreate} 
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    size="lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Record
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 border-b border-gray-200/50 p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                    Data Records
                  </CardTitle>
                  <p className="text-gray-600">Manage and organize your {module?.name.toLowerCase()} data</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                    {moduleData.length} {moduleData.length === 1 ? 'entry' : 'entries'} loaded
                  </Badge>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search records..."
                      className="w-64 pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading data...</p>
                </div>
              ) : moduleData.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-3">No records found</h3>
                  <p className="text-gray-600 mb-8">Get started by adding your first record.</p>
                  <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Record
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        {/* Dynamic columns based on table structure */}
                        {tableColumns.length > 0 ? (
                          tableColumns
                            .filter(col => !['created_at', 'updated_at', 'deleted_at'].includes(col.Field))
                            .slice(0, 5) // Limit to 5 columns for better display
                            .map((col) => (
                              <th key={col.Field} className="text-left p-4 capitalize">
                                {col.Field.split('_').join(' ')}
                              </th>
                            ))
                        ) : (
                          // Fallback headers when no table structure is available
                          <>
                            <th className="text-left p-4">ID</th>
                            <th className="text-left p-4">Title</th>
                            <th className="text-left p-4">Date</th>
                          </>
                        )}
                        <th className="text-right p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {moduleData.map((item) => {
                        const displayColumns = tableColumns.length > 0 
                          ? tableColumns
                              .filter(col => !['created_at', 'updated_at', 'deleted_at'].includes(col.Field))
                              .slice(0, 5)
                          : [{ Field: 'id', Type: 'int' }, { Field: 'title', Type: 'varchar' }, { Field: 'created_at', Type: 'datetime' }];
                        
                        return (
                          <tr key={item.id} className="border-b hover:bg-gray-50">
                            {displayColumns.map((col) => {
                              const value = item[col.Field];
                              let displayValue = value || '-';
                              
                              // Format different data types
                              if (col.Field === 'id') {
                                displayValue = `#${value}`;
                              } else if (col.Type.includes('date') || col.Type.includes('time')) {
                                displayValue = value ? new Date(value).toLocaleDateString() : '-';
                              } else if (col.Type.includes('text') && value && value.length > 100) {
                                displayValue = value.substring(0, 100) + '...';
                              }
                              
                              return (
                                <td key={col.Field} className="p-4">
                                  {col.Field === 'id' ? (
                                    <span className="font-mono text-sm">{displayValue}</span>
                                  ) : col.Field.includes('title') || col.Field.includes('name') ? (
                                    <span className="font-semibold">{displayValue}</span>
                                  ) : (
                                    <span className="text-gray-600">{displayValue}</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-4">
                              <div className="flex items-center justify-end gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Create/Edit Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingItem ? 'Edit' : 'Create'} {module?.name}
              </DialogTitle>
            </DialogHeader>
            <EditForm 
              item={editingItem}
              onSave={handleSave}
              onCancel={() => setShowCreateModal(false)}
              dept={dept}
              selectedModule={selectedModule}
            />
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Main dashboard view
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/')}
                  className="flex items-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-4 py-2 rounded-lg transition-all duration-200 border border-blue-200 font-medium"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                  className="flex items-center text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
                >
                  ← Previous Page
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">{departmentName}</h1>
                    <p className="text-lg text-gray-600">Department Dashboard</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-700">Welcome back, <span className="font-semibold">{user?.username}</span>!</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <span className="text-sm text-gray-600">Role:</span>
                <Badge className="capitalize bg-blue-100 text-blue-800">{user?.role}</Badge>
              </div>
              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-2xl font-bold text-gray-800">{departmentName}</p>
                  <p className="text-xs text-blue-600">Active Status</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Available Modules</p>
                  <p className="text-2xl font-bold text-gray-800">{currentModules.length}</p>
                  <p className="text-xs text-green-600">Ready to use</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                  <FileText className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Access Level</p>
                  <p className="text-2xl font-bold text-gray-800 capitalize">{user?.role}</p>
                  <p className="text-xs text-purple-600">Permissions enabled</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modules Grid */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50/80 to-blue-50/80 border-b border-gray-200/50 p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <Grid3X3 className="w-6 h-6 text-blue-600" />
                  Department Modules
                </CardTitle>
                <CardDescription className="text-lg">Access and manage your department's content modules</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {filteredModules.length} modules available
                </Badge>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search modules..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64 pl-10 border-gray-200 focus:border-blue-300 focus:ring-blue-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card 
                    key={module.key}
                    className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-xl overflow-hidden"
                    onClick={() => handleModuleSelect(module.key)}
                  >
                    <CardContent className="p-6 h-full">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                            <IconComponent className="w-7 h-7 text-white" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">{module.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-3">{module.description}</p>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600 rounded-full">
                            {module.table}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>


            {filteredModules.length === 0 && (
              <div className="col-span-full text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">No modules found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search term or check back later.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm('')}
                  className="hover:bg-blue-50 hover:border-blue-200"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Dynamic Form component for editing
function EditForm({ 
  item, 
  onSave, 
  onCancel,
  dept,
  selectedModule 
}: { 
  item: ModuleData | null; 
  onSave: (data: any) => void; 
  onCancel: () => void;
  dept: string;
  selectedModule: string;
}) {
  const [formData, setFormData] = useState<any>({});
  const [tableFields, setTableFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
    fetchTableStructure();
  }, [item, dept, selectedModule]);

  const fetchTableStructure = async () => {
    setLoading(true);
    try {
      const authToken = localStorage.getItem('authToken');
      const result = await fetchWithErrorHandling(`/api/admin/departments/${dept}/${selectedModule}/structure`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });

      setTableFields(result.fields || []);
    } catch (error) {
      console.error('Error fetching table structure:', error);
      // Fallback to default fields if API fails
      setTableFields([
        { Field: 'title', Type: 'varchar(255)', Null: 'YES' },
        { Field: 'description', Type: 'text', Null: 'YES' },
        { Field: 'content', Type: 'text', Null: 'YES' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalFormData = { ...formData };
    
    // Handle file upload for file URL fields
    if (selectedFile) {
      setUploadingFile(true);
      try {
        const authToken = localStorage.getItem('authToken');
        const fileFormData = new FormData();
        fileFormData.append('file', selectedFile);
        
        // Add existing URL if updating (for automatic deletion/override)
        const fileUrlField = getEditableFields().find(field => 
          field.Field.toLowerCase().includes('url') || 
          field.Field.toLowerCase().includes('file') ||
          field.Field.toLowerCase().includes('document') ||
          field.Field.toLowerCase().includes('link')
        );
        
        // For edit mode, always include existing file URL to override it
        if (item && fileUrlField && item[fileUrlField.Field]) {
          fileFormData.append('existingUrl', item[fileUrlField.Field]);
          fileFormData.append('overwriteExisting', 'true'); // Signal to override
        }
        
        // Add record ID for tracking file associations
        if (item && item.id) {
          fileFormData.append('recordId', item.id.toString());
        }
        
        // Use CST-specific endpoint for CST, generic endpoint for others
        const uploadUrl = dept === 'cst' 
          ? `/api/admin/departments/cst/${selectedModule}/upload`
          : `/api/admin/departments/${dept}/${selectedModule}/upload`;
        
        const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: fileFormData
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Upload failed');
        }
        
        const uploadResult = await uploadResponse.json();
        
        // Use the previously found fileUrlField to update the form data
        if (fileUrlField) {
          finalFormData[fileUrlField.Field] = uploadResult.data.url;
        } else {
          // Default to file_url if no specific field found
          finalFormData.file_url = uploadResult.data.url;
        }
        
        const uploadSizeKB = uploadResult.data.size;
        const uploadSizeMB = (uploadSizeKB / 1024).toFixed(2);
        
        if (item && item.id) {
          toast.success('📝 File Updated Successfully!', {
            description: `File overridden successfully (${uploadSizeKB}KB / ${uploadSizeMB}MB)`,
            duration: 4000
          });
        } else {
          toast.success('🎉 Upload Successful!', {
            description: `File uploaded successfully (${uploadSizeKB}KB / ${uploadSizeMB}MB)`,
            duration: 4000
          });
        }
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Upload failed');
        setUploadingFile(false);
        return;
      } finally {
        setUploadingFile(false);
      }
    }
    
    onSave(finalFormData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeKB = Math.round(file.size / 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      // Validate file type (expanded to support more file types)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('⚠️ Invalid File Type', {
          description: 'Please select a valid file. Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX',
          duration: 5000
        });
        e.target.value = '';
        return;
      }
      
      // Validate file size (1MB)
      const maxSize = 1024 * 1024; // 1MB
      if (file.size > maxSize) {
        toast.error('🚨 File Too Large!', {
          description: `File size (${fileSizeMB}MB) exceeds the 1MB limit. Please compress or select a smaller file.`,
          duration: 8000
        });
        e.target.value = '';
        return;
      }
      
      // Show warning for files larger than 500KB
      if (file.size > 512 * 1024) {
        toast.warning('⚠️ Large File Warning', {
          description: `File size is ${fileSizeMB}MB. Consider compressing for faster upload.`,
          duration: 4000
        });
      }
      
      setSelectedFile(file);
      toast.success('✅ File Ready for Upload', {
        description: `${file.name} (${fileSizeKB}KB) selected successfully`,
        duration: 3000
      });
    } else {
      setSelectedFile(null);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  const getInputType = (fieldType: string, fieldName: string) => {
    const type = fieldType.toLowerCase();
    const name = fieldName.toLowerCase();
    
    if (name.includes('email')) return 'email';
    if (name.includes('phone') || name.includes('mobile')) return 'tel';
    if (name.includes('url') || name.includes('link')) return 'url';
    if (name.includes('date')) return 'date';
    if (name.includes('time')) return 'time';
    if (type.includes('int') || type.includes('decimal') || type.includes('float')) return 'number';
    if (type.includes('text') || type.includes('longtext')) return 'textarea';
    if (type.includes('json')) return 'textarea';
    
    return 'text';
  };

  const getEditableFields = () => {
    if (tableFields.length > 0) {
      return tableFields.filter(field => 
        !['id', 'dept', 'created_at', 'updated_at', 'deleted_at', 'minutes_url', 'agenda'].includes(field.Field)
      );
    }
    
    // Fallback for when table structure isn't available
    if (item && Object.keys(item).length > 0) {
      return Object.keys(item)
        .filter(key => !['id', 'dept', 'created_at', 'updated_at', 'deleted_at', 'minutes_url', 'agenda'].includes(key))
        .map(field => ({ Field: field, Type: 'varchar(255)', Null: 'YES' }));
    }
    
    return [
      { Field: 'title', Type: 'varchar(255)', Null: 'YES' },
      { Field: 'description', Type: 'text', Null: 'YES' }
    ];
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Loading form...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-96 overflow-y-auto">
      {getEditableFields().map((field) => {
        const inputType = getInputType(field.Type, field.Field);
        const isRequired = field.Null === 'NO';
        const fieldName = field.Field;
        const displayName = fieldName.split('_').map((word: string) => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');

        return (
          <div key={fieldName} className="space-y-2">
            <Label htmlFor={fieldName} className="flex items-center gap-1">
              {displayName}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            
            {inputType === 'textarea' ? (
              <Textarea
                id={fieldName}
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder={`Enter ${displayName.toLowerCase()}`}
                rows={3}
                required={isRequired}
              />
            ) : inputType === 'number' ? (
              <Input
                id={fieldName}
                type="number"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder={`Enter ${displayName.toLowerCase()}`}
                required={isRequired}
              />
            ) : inputType === 'date' ? (
              <Input
                id={fieldName}
                type="date"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                required={isRequired}
              />
            ) : inputType === 'time' ? (
              <Input
                id={fieldName}
                type="time"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                required={isRequired}
              />
            ) : inputType === 'email' ? (
              <Input
                id={fieldName}
                type="email"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder={`Enter ${displayName.toLowerCase()}`}
                required={isRequired}
              />
            ) : inputType === 'tel' ? (
              <Input
                id={fieldName}
                type="tel"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder={`Enter ${displayName.toLowerCase()}`}
                required={isRequired}
              />
            ) : inputType === 'url' && (
              fieldName.toLowerCase().includes('url') || 
              fieldName.toLowerCase().includes('file') ||
              fieldName.toLowerCase().includes('document') ||
              fieldName.toLowerCase().includes('link')
            ) ? (
              // File upload for all departments with file URL fields
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-yellow-800 mb-2">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold text-sm">File Upload Guidelines</span>
                  </div>
                  <div className="text-xs text-yellow-700 space-y-1">
                    <p>• <span className="font-medium">Maximum size: 1MB</span> - Files larger than 1MB will be rejected</p>
                    <p>• Supported formats: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX</p>
                    <p>• Files will be stored in: /uploads/{dept}/{selectedModule}/</p>
                  </div>
                </div>
                <Input
                  id={`${fieldName}-upload`}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
                {formData[fieldName] && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                    <p className="text-xs text-blue-700 font-medium mb-1">📎 Current file:</p>
                    <a 
                      href={formData[fieldName]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-all"
                    >
                      {formData[fieldName]}
                    </a>
                  </div>
                )}
                {selectedFile && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                    <p className="text-xs text-green-700 font-medium mb-1">✅ New file ready:</p>
                    <p className="text-xs text-green-600">{selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)</p>
                  </div>
                )}
              </div>
            ) : inputType === 'url' ? (
              <Input
                id={fieldName}
                type="url"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder={`Enter ${displayName.toLowerCase()}`}
                required={isRequired}
              />
            ) : (
              <Input
                id={fieldName}
                type="text"
                value={formData[fieldName] || ''}
                onChange={(e) => handleChange(fieldName, e.target.value)}
                placeholder={`Enter ${displayName.toLowerCase()}`}
                required={isRequired}
              />
            )}
          </div>
        );
      })}
      
      <DialogFooter className="gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={uploadingFile}>
          Cancel
        </Button>
        <Button type="submit" disabled={uploadingFile}>
          {uploadingFile ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Uploading...
            </div>
          ) : (
            item ? 'Update' : 'Create'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
