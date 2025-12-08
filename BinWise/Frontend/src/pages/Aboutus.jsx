import React from "react";
import Card from "../components/Card";
import Badge from "../components/Badge";
import { Heart, Target, Eye, Users, Award, Globe, Recycle } from "lucide-react";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export function AboutPage() {
  const teamMembers = [
    {
        id: 1,
      name: "Sarah Johnson",
      role: "CEO & Co-Founder",
      bio: "Environmental engineer with 10+ years experience in sustainability solutions.",
      image: "https://images.unsplash.com/photo-1690264459607-a90b23d887f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300"
    },
    {
        id: 2,
      name: "Michael Chen",
      role: "CTO & Co-Founder",
      bio: "AI and machine learning expert passionate about using technology for environmental good.",
      image: "https://images.unsplash.com/photo-1690264459607-a90b23d887f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300"
    },
    {
        id: 3,
      name: "Emily Rodriguez",
      role: "Head of Operations",
      bio: "Operations specialist focused on scaling sustainable business practices.",
      image: "https://images.unsplash.com/photo-1690264459607-a90b23d887f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300"
    },
    {
        id: 4,
      name: "David Kim",
      role: "Product Manager",
      bio: "UX advocate dedicated to making recycling accessible and rewarding for everyone.",
      image: "https://images.unsplash.com/photo-1690264459607-a90b23d887f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300"
    }
  ];

  const stats = [
    { id:1, number: "28,492", label: "Active Users", icon: Users },
    { id:2, number: "15,847", label: "Tons Recycled", icon: Recycle },
    {id:3,  number: "50+", label: "Cities Served", icon: Globe },
    { id:4, number: "99.2%", label: "User Satisfaction", icon: Heart }
  ];

  const values = [
    {
        id:1,
      icon: Globe,
      title: "Environmental Impact",
      description: "We believe every small action contributes to a healthier planet for future generations."
    },
    {
        id:2,
      icon: Users,
      title: "Community First",
      description: "Building stronger communities through shared environmental responsibility and education."
    },
    {
        id:3,
      icon: Award,
      title: "Innovation",
      description: "Using cutting-edge technology to solve complex environmental challenges."
    },
    {
        id:4,
      icon: Heart,
      title: "Accessibility",
      description: "Making recycling easy, rewarding, and accessible to everyone, everywhere."
    }
  ];

  const milestones = [
    { id:1, year: "2022", achievement: "Company Founded", description: "Started with a vision to revolutionize recycling" },
    { id:2, year: "2023", achievement: "AI Launch", description: "Launched AI-powered material recognition technology" },
    { id:3, year: "2023", achievement: "10K Users", description: "Reached 10,000 active users in our first year" },
    { id:4, year: "2024", achievement: "1M lbs Recycled", description: "Community collectively recycled over 1 million pounds" },
    { id:5, year: "2024", achievement: "National Expansion", description: "Expanded services to 50+ cities across the country" }
  ];

  return (
    <section >
      <NavBar />
    <section className="min-h-screen bg-gray-50 overflow-x-hidden ">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20 text-center ">
        <h1 className="text-5xl font-bold mb-6">About <span className="text-yellow-300">Bin Wise</span></h1>
        <p className="max-w-3xl mx-auto text-lg">
      At Bin Wise, we believe that small steps can create a big change. Our mission is to make recycling easier, smarter, and more accessible for everyone.

We provide a platform that helps individuals and communities dispose of waste properly while encouraging eco-friendly habits. By separating recyclable materials and raising awareness, we aim to reduce pollution, save natural resources, and build a cleaner future.

Together, we can turn waste into a valuable resource. With Bin Wise, every action counts toward protecting our environment for the next generations.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">



        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.id}
                content={
                  <div className="text-center">
                    <Icon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                }
              />
            );
          })}
        </section>

        <section className="flex flex-col md:flex-row gap-6 items-center mx-10">
          <div className="flex flex-col gap-5">
            <h2 className="text-black text-bold text-[32px]">Who we are?</h2>
          <p>
            We are a recycling initiative dedicated to creating a cleaner and more sustainable future. Our mission is to reduce waste, raise awareness, and encourage communities to adopt eco-friendly practices. By connecting individuals and organizations, we aim to make recycling simple, accessible, and impactful for everyone.
          </p>

                    {/* Badges */}
        <div className="flex flex-wrap gap-4">
          <Badge variant="outline">Founded 2022</Badge>
          <Badge variant="outline">AI-Powered</Badge>
          <Badge variant="outline">Community-Driven</Badge>
        </div>
          </div>
          <div className="w-full">
            <img
            className="w-full"
            src="https://images.unsplash.com/photo-1653406384710-08688ec6b979?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWN5Y2xpbmclMjBiaW5zJTIwcGxhc3RpYyUyMGJvdHRsZXN8ZW58MXx8fHwxNzU2OTM1ODcyfDA&ixlib=rb-4.1.0&q=80&w=1080" alt="recycling" />
          </div>
        </section>

        {/*  */}

        <section className="flex flex-col md:flex-row justify-evenly items-center md:mx-20">
          <Card
            className="flex-1 m-4"
            content={
              <div className="flex flex-col   gap-4">
                
                <h3 className="text-xl font-semibold flex gap-2 items-center"><Target className="h-10 w-10 text-green-600 inline" /> Our Mission</h3>
                <p className="text-gray-600">To revolutionize recycling through innovative technology that makes sustainable practices accessible, rewarding, and impactful for individuals and communities worldwide. We strive to create a world where every person has the tools and motivation to contribute to a circular economy.</p>
                </div>}
          />
          <Card
            className="flex-1 m-4"
            content={       
                  <div className="flex flex-col  gap-4">      
                <h3 className="text-xl font-semibold flex gap-2 items-center"> <Eye className="h-10 w-10 text-blue-600 inline" />Our Vision</h3>
                <p className="text-gray-600">A future where waste becomes a resource, where every community has access to smart recycling solutions, and where environmental stewardship is seamlessly integrated into daily life. We envision a world where our technology helps eliminate waste and creates a truly sustainable planet.</p>
                </div>}
          />
        </section>

        {/* Values */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="flex flex-col col-span-full items-center mb-6 justify-center">
            <h2 className="text-[32px] text-bold">Our Values</h2>
            <p className="text-gray-600">the principles that guide everything we do</p>
        </div>
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <Card
                key={value.id}
                title={<div className="flex items-center gap-2"><Icon className="h-6 w-6 text-green-600"/>{value.title}</div>}
                content={<p className="text-gray-600">{value.description}</p>}
              />
            );
          })}
        </section>

        {/* Milestones */}
        <section className="space-y-6">
          {milestones.map((m) => (
      <div 
        key={m.id}
      className="flex items-center justify-center gap-6">
                              <div className="flex-shrink-0 w-25 h-25 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">{m.year}</div>
        
            <Card
            className="flex-1"
              content={
                <div className="flex flex-col  gap-4">
                    <h3 className="text-xl font-semibold">{m.achievement}</h3>
                    <p className="text-gray-600">{m.description}</p>
                  </div>
              }
            />
      </div>
          ))}
        </section>

        {/* Team */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <Card
              key={member.id}
              content={
                <>
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-4">
                    <img src={member.image} alt={member.name} className="w-full h-full object-cover"/>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 text-center">{member.name}</h3>
                  <p className="text-green-600 font-medium text-center">{member.role}</p>
                  <p className="text-gray-600 text-sm text-center">{member.bio}</p>
                </>
              }
            />
          ))}
        </section>

  {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
          
            content={
         <div className="p-8">
                     <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Join our community of environmental champions and start your smart recycling journey today. 
                Together, we can create a more sustainable future.
              </p>
                <button 
                  className="bg-green-700 hover:bg-green-900 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition cursor-pointer duration-300"
                  onClick={() => window.location.href = '/recycle-scanner'}
                >
                  Start Recycling Now
                </button>
          </div>
            }
          />
        </section>
      </div>
      <Footer />
      </section>
    </section>
  );
}
export default AboutPage;