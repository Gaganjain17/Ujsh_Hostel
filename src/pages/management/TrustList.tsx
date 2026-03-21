import PageHero from "@/components/shared/PageHero";
import SectionWrapper from "@/components/shared/SectionWrapper";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const trusteeData = [
  { sr: 1, name: "Shri Nemchand Pacharbhai and Lakdibhai Trust (The trust has recently surrendered 15 seats)", seats: 8 },
  { sr: 2, name: "Shri K. N. Shah Charitable Trust", seats: 6 },
  { sr: 3, name: "Shri C. U. Shah Charitable Trust", seats: 5 },
  { sr: 4, name: "Shri Deepchand Gardi Charitable Trust", seats: 3 },
  { sr: 5, name: "Shri Uttambhai N. Mehta Charitable Trust", seats: 3 },
  { sr: 6, name: "Shri J. R. Shah Charitable Trust", seats: 2 },
  { sr: 7, name: "Shri C. N. Sanghavi Charitable Trust", seats: 2 },
  { sr: 8, name: "Shri Bipinbhai B. Shah Charitable Trust", seats: 4 },
  { sr: 9, name: "Shri Deepchand LakshmiChand Sanghavi Trust", seats: 2 },
  { sr: 10, name: "Shri Jeevanlal Veerchand Mehta Trust", seats: 2 },
  { sr: 11, name: "Shri Navinchandra Keshavlal Kapadia Charity Trust", seats: 2 },
  { sr: 12, name: "Shri Mahipalbhai Charitable Trust", seats: 2 },
  { sr: 13, name: "Shri Gambhirchand Oomedchand Shah Trust", seats: 2 },
  { sr: 14, name: "Shri Tarachand Dhanji Mehta Trust", seats: 1 },
  { sr: 15, name: "Shri Mulchand Shah Varalwala Trust", seats: 1 },
  { sr: 16, name: "Shri Bhupatrai Premchand Kapadia Trust", seats: 1 },
  { sr: 17, name: "Shri Ratilal Chimanlal Kothari Trust", seats: 1 },
  { sr: 18, name: "Shri Hargovindas C. Gandhi Trust", seats: 1 },
  { sr: 19, name: "Shri Chimanlal M. Shah Trust", seats: 1 },
  { sr: 20, name: "Shri Kuidal Chaturbhuj Doshi Trust", seats: 1 },
  { sr: 21, name: "Shri Dhansukhlal Virji Sanghavi Charitable Trust", seats: 1 },
  { sr: 22, name: "Shri Mukesh Babu", seats: 1 },
  { sr: 23, name: "Smt. Nandita Jayant Chheda", seats: 1 },
  { sr: 24, name: "Shri Sheth Kantilal Keshavlal", seats: 1 },
  { sr: 25, name: "Shri Sanghavi Anandlal & Sanghavi Chanchalben A Trust", seats: 1 },
  { sr: 26, name: "Shri Vijay H. Shroff Charitable Trust", seats: 1 },
  { sr: 27, name: "Shri Vinodchand Uttamchand Shah Charitable Trust", seats: 1 },
  { sr: 28, name: "Shri L. N. Gandhi Charitable Trust", seats: 1 },
  { sr: 29, name: "Shri Chinubhai Shah Research Center", seats: 1 },
  { sr: 30, name: "Shri Paresh Sanjay Vora Charitable Trust", seats: 1 },
  { sr: 31, name: "B. Arunkumar & Co.", seats: 1 },
  { sr: 32, name: "Shri Padmaful Charitable Trust", seats: 1 },
  { sr: 33, name: "Shri Pradeepbhai Shah & Others", seats: 1 },
  { sr: 34, name: "Shri Himmatlal O. Gandhi", seats: 1 },
  { sr: 35, name: "Shri B. C. Mehta", seats: 1 },
  { sr: 36, name: "Shri Dhirajlal Mohtanlal", seats: 1 },
  { sr: 37, name: "Shri Br. Manubhai Shah", seats: 1 },
  { sr: 38, name: "K. L. Bhakti Charitable Trust", seats: 1 },
  { sr: 39, name: "Shri Ramesh Shah & Other Past Students", seats: 1 },
  { sr: 40, name: "Shri Mafatlal M. Shah", seats: 1 },
  { sr: 41, name: "Shri A. R. Shah", seats: 1 },
  { sr: 42, name: "Shri Chinubhai Chaganlal Shah", seats: 1 },
  { sr: 43, name: "Mrs. C. M. & M. K. Shah Charitable Trust", seats: 1 },
  { sr: 44, name: "J B Mehta Vallabhipur", seats: 1 },
];

const totalSeats = trusteeData.reduce((sum, t) => sum + t.seats, 0);

export default function TrustList() {
  return (
    <>
      <PageHero title="Trust List" subtitle="The governing body of United Jain Students Home" />
      <SectionWrapper>
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-primary/10">
                  <TableHead className="w-16 font-display font-semibold text-foreground">Sr. No</TableHead>
                  <TableHead className="font-display font-semibold text-foreground">Trustee Name</TableHead>
                  <TableHead className="w-32 text-center font-display font-semibold text-foreground">Seats</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trusteeData.map((t) => (
                  <TableRow key={t.sr} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{t.sr}</TableCell>
                    <TableCell>{t.name}</TableCell>
                    <TableCell className="text-center font-semibold">{t.seats}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-primary/10 font-bold">
                  <TableCell></TableCell>
                  <TableCell className="font-display font-bold text-foreground">Total</TableCell>
                  <TableCell className="text-center font-display font-bold text-foreground">{totalSeats}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
}
