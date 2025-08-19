
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
      <AccordionItem value="item-4">
        <AccordionTrigger>Is my chat file stored</AccordionTrigger>
        <AccordionContent>
        BIG NOOOO. this software is running on your browser only, no servers involved. Only when you use "ASK AI" feature then it goes to Gemini AI Model to provide response but clear the chat files once query is done, which is means neither i can store your chats nor a model.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-5">
        <AccordionTrigger>whats your intention of creating this awesome website?</AccordionTrigger>
        <AccordionContent>
        Straightforward- Wanna surprise my GF; Being a Solo versatile developer I wanted to showcase my creative skills by solving a genuine problem of my GF, yes sometimes she kind of forgets things easily (No Alhzeimer). How can she forget my blood group? even after telling her, she told "Oh! you was confused so i thought you have A+". thats, where i started to work on this project.. interested to know more about our clingy bond ?
        </AccordionContent>
      </AccordionItem>
    </Accordion>
        </CardContent>

        </Card>
    );
    }
export default FAQ;
