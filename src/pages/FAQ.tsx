import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Who can apply for accommodation at UJSH?", a: "UJSH is exclusively for Jain students who are pursuing their education in Mumbai." },
  { q: "What type of rooms are available?", a: "We offer sharing rooms with four beds, separate cupboards for each resident, and a large central writing table." },
  { q: "Is the mess food purely Jain?", a: "Yes, the Mess exclusively serves Jain cuisine. We also provide Tiffin services and accommodate guests for meals." },
  { q: "What are the library timings?", a: "Our library is accessible 24/7 with air-conditioned comfort and electricity at every table." },
  { q: "Is there a gymnasium?", a: "Yes, we have a fully equipped gymnasium with exercise machines, weights, and other fitness equipment." },
  { q: "How do I apply for admission?", a: "You can download the application form from our website or visit the hostel office. Fill in the details and submit with required documents." },
  { q: "What is the fee structure?", a: "Please contact the hostel office at +91 82918 29191 or email ujshsion1@gmail.com for the latest fee details." },
  { q: "Are guests allowed?", a: "Guest policies are managed by the hostel committee. Please check with the office for current guidelines." },
];

export default function FAQ() {
  return (
    <>
      <PageHero title="Frequently Asked Questions" subtitle="Answers to common queries about UJSH" />
      <SectionWrapper>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-display">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </SectionWrapper>
    </>
  );
}
