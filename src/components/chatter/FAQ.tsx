
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const FAQ = () => {
    return (
        <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            here are some of the questions that might pop into your head.
          </CardDescription>
        </CardHeader>
        <CardContent>

        <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>How to export whatasapp chat data?</AccordionTrigger>
        <AccordionContent>
        Open WhatsApp, open the 
chat you want to export, tap the three-dot menu in the top-right corner,
 tap More, then select Export chat, choose whether to Include media or
 Without media, then choose how you want to share or save the exported file (such as Gmail, Google Drive, etc.).
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>what is Correlation?</AccordionTrigger>
        <AccordionContent>
        The correlation feature compares two chat 
files to find similarities in timing, content, and patterns. It reveals overlaps, shared topics, or synchronized activity between conversations.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>why should i buy premium?</AccordionTrigger>
        <AccordionContent>
        my gf family is going through a lot , 
i want to help them, and .... dont worry everything is fine till with god's grace, yeaah i need money bcz the servers bills are not a joke
        </AccordionContent>
      </AccordionItem>
    </Accordion>
        </CardContent>

        </Card>
    );
    }
export default FAQ;
