"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const FormSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

export default function HorizontalSubscribeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
    },
  })

  async function onSubmit({firstname, lastname, email}: z.infer<typeof FormSchema>) {
    setIsSubmitting(true)
    try {
      const emailResponse = await fetch('/api/contact-us', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          email: email,
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send welcome email')
      }

      const supabase = createClient()
      const { error } = await supabase.from('subscribers').insert({
        first_name: firstname,
        last_name: lastname,
        email: email,
      })
          
      if (error) throw new Error('Failed to save subscription')

      form.reset()
      toast.success('Welcome! Check your email for confirmation.')
         
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error(error instanceof Error ? error.message : "Failed to process subscription")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full py-8 px-4 bg-gray-50 border-t border-b border-gray-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold text-gray-900">
            Get the scriptures and teachings directly to your inbox
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            Join us today. Subscribe below
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4 max-w-2xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="First name" 
                        {...field} 
                        className="bg-white border-gray-200 h-12 text-lg"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastname"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        placeholder="Last name" 
                        {...field}
                        className="bg-white border-gray-200 h-12 text-lg"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Email address" 
                      {...field}
                      className="bg-white border-gray-200 h-12 text-lg"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-lg font-medium"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}