'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@acme/ui/card';
import { contactInfo } from '@acme/white-label/web-app';
import { Clock, Mail, MapPin, Phone } from 'lucide-react';

export default function Page() {
  return (
    <div className="p-4 md:p-6 flex-1">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Support & Contact</h1>
          <p className="text-muted-foreground">Get in touch with our support team</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`mailto:${contactInfo.email}`} className="text-primary hover:underline">
                {contactInfo.email}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a href={`tel:${contactInfo.phone}`} className="text-primary hover:underline">
                {contactInfo.phone}
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{contactInfo.address}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Support Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{contactInfo.supportHours}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
