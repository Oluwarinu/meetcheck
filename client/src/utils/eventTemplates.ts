
export const defaultParticipantFields = [
  { id: "name", label: "Full Name", required: true, enabled: true },
  { id: "email", label: "Email Address", required: true, enabled: true },
  { id: "phone", label: "Phone Number", required: false, enabled: false },
  { id: "registration", label: "Registration Number", required: false, enabled: false },
  { id: "gender", label: "Gender", required: false, enabled: false },
  { id: "organization", label: "Organization", required: false, enabled: false },
  { id: "position", label: "Position/Title", required: false, enabled: false },
  { id: "dietary", label: "Dietary Requirements", required: false, enabled: false },
];

export const getTemplateTitle = (templateId: string) => {
  const titles = {
    lecture: "Academic Lecture - ",
    wedding: "Wedding Celebration - ",
    conference: "Business Conference - ",
    workshop: "Workshop/Training - "
  };
  return titles[templateId as keyof typeof titles] || "";
};

export const getTemplateDescription = (templateId: string) => {
  const descriptions = {
    lecture: "Join us for an engaging academic presentation covering important topics in your field of study.",
    wedding: "Celebrate this special day with us as we unite two hearts in marriage. Your presence will make our day even more memorable.",
    conference: "Connect with industry professionals, learn from expert speakers, and discover the latest trends and innovations.",
    workshop: "Enhance your skills through hands-on learning and interactive sessions led by experienced instructors."
  };
  return descriptions[templateId as keyof typeof descriptions] || "";
};
