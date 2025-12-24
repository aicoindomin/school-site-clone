import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, CreditCard, Smartphone, Building } from "lucide-react";

const paymentMethods = [
  {
    title: "Online Payment",
    description: "Pay securely using credit/debit cards or net banking",
    icon: CreditCard,
  },
  {
    title: "UPI Payment",
    description: "Quick payment via Google Pay, PhonePe, or any UPI app",
    icon: Smartphone,
  },
  {
    title: "Bank Transfer",
    description: "Direct transfer to school bank account",
    icon: Building,
  },
];

export function FeePaymentSection() {
  return (
    <section id="fee-payment" className="py-20 bg-muted/50">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-primary font-medium text-sm uppercase tracking-wider mb-4">
            Online Fee Payment
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
            Pay School Fees Conveniently
          </h2>
          <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
            Multiple payment options available for hassle-free fee payment from 
            anywhere, anytime.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {paymentMethods.map((method) => (
              <div 
                key={method.title}
                className="bg-card rounded-xl p-6 shadow-elegant hover-lift"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {method.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {method.description}
                </p>
              </div>
            ))}
          </div>

          <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
            <a href="https://payment.example.com" target="_blank" rel="noopener noreferrer">
              Pay Fees Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
