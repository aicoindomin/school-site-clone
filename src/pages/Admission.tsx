import { useState, useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, CheckCircle, MessageCircle } from "lucide-react";
import { TranslatedText } from "@/components/TranslatedText";

const grades = [
  "Prep-I",
  "KG-I",
  "KG-II",
  "Class I",
  "Class II",
  "Class III",
  "Class IV",
  "Class V"
];

const Admission = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [whatsappSettings, setWhatsappSettings] = useState<{ whatsapp_number: string; is_active: boolean } | null>(null);
  const [formData, setFormData] = useState({
    student_name: "",
    parent_name: "",
    email: "",
    phone: "",
    grade_applying: "",
    message: ""
  });

  useEffect(() => {
    const fetchWhatsappSettings = async () => {
      const { data } = await supabase
        .from("whatsapp_settings")
        .select("whatsapp_number, is_active")
        .eq("is_active", true)
        .maybeSingle();
      
      if (data) {
        setWhatsappSettings(data);
      }
    };
    fetchWhatsappSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendToWhatsApp = () => {
    if (!whatsappSettings?.whatsapp_number) return;

    const message = `🎓 *New Admission Inquiry*

👤 *Student Name:* ${formData.student_name}
👨‍👩‍👦 *Parent Name:* ${formData.parent_name}
📧 *Email:* ${formData.email || "Not provided"}
📱 *Phone:* ${formData.phone}
📚 *Grade:* ${formData.grade_applying}
${formData.message ? `💬 *Message:* ${formData.message}` : ""}

_Sent from Balisai Public School Website_`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${whatsappSettings.whatsapp_number}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_name || !formData.parent_name || !formData.phone || !formData.grade_applying) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from("admission_inquiries")
      .insert([formData]);

    if (error) {
      toast.error("Failed to submit. Please try again.");
      console.error(error);
    } else {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
      
      // Send to WhatsApp if enabled
      if (whatsappSettings?.is_active) {
        sendToWhatsApp();
      }
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <MainLayout>
        <section className="py-16 bg-background">
          <div className="container">
            <Card className="max-w-lg mx-auto text-center">
              <CardContent className="py-12">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
                <h2 className="font-display text-2xl font-bold mb-4">
                  <TranslatedText>Application Submitted!</TranslatedText>
                </h2>
                <p className="text-muted-foreground mb-6">
                  <TranslatedText>
                    Thank you for your interest in Balisai Public School. 
                    We have received your admission inquiry and will contact you soon.
                  </TranslatedText>
                </p>
                <Button onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    student_name: "",
                    parent_name: "",
                    email: "",
                    phone: "",
                    grade_applying: "",
                    message: ""
                  });
                }}>
                  <TranslatedText>Submit Another Application</TranslatedText>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              <TranslatedText>Apply for Admission</TranslatedText>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              <TranslatedText>Fill out the form below to apply for admission at Balisai Public School</TranslatedText>
            </p>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TranslatedText>Admission Inquiry Form</TranslatedText>
                {whatsappSettings?.is_active && (
                  <MessageCircle className="w-5 h-5 text-green-500" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_name">
                      <TranslatedText>Student Name</TranslatedText> *
                    </Label>
                    <Input
                      id="student_name"
                      name="student_name"
                      value={formData.student_name}
                      onChange={handleChange}
                      placeholder="Enter student's full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parent_name">
                      <TranslatedText>Parent/Guardian Name</TranslatedText> *
                    </Label>
                    <Input
                      id="parent_name"
                      name="parent_name"
                      value={formData.parent_name}
                      onChange={handleChange}
                      placeholder="Enter parent's full name"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      <TranslatedText>Email Address (Optional)</TranslatedText>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      <TranslatedText>Phone Number</TranslatedText> *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit mobile number"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grade_applying">
                    <TranslatedText>Grade Applying For</TranslatedText> *
                  </Label>
                  <Select
                    value={formData.grade_applying}
                    onValueChange={(value) => setFormData({ ...formData, grade_applying: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    <TranslatedText>Additional Message (Optional)</TranslatedText>
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Any additional information you'd like to share"
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <TranslatedText>Submitting...</TranslatedText>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      <TranslatedText>Submit Application</TranslatedText>
                    </>
                  )}
                </Button>

                {whatsappSettings?.is_active && (
                  <p className="text-center text-sm text-muted-foreground">
                    <MessageCircle className="w-4 h-4 inline-block mr-1 text-green-500" />
                    <TranslatedText>Your inquiry will also be sent to our WhatsApp for faster response</TranslatedText>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </MainLayout>
  );
};

export default Admission;
